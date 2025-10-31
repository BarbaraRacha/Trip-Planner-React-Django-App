import requests
from datetime import datetime, timedelta
from typing import List, Dict
import math
from decouple import config
import json

class ELDCalculator:
    """Calculateur ELD conforme aux régulations FMCSA - Utilise OpenRouteService"""
    
    # Règles FMCSA pour property-carrying drivers
    MAX_DRIVING_TIME = 11  # heures
    MAX_ON_DUTY_TIME = 14  # heures
    MAX_CYCLE_TIME = 70    # heures sur 8 jours
    REQUIRED_BREAK_TIME = 0.5  # 30 min après 8h de conduite
    REQUIRED_OFF_DUTY = 10  # heures
    FUEL_STOP_INTERVAL = 1000  # miles
    FUEL_STOP_DURATION = 0.25  # 15 minutes
    PICKUP_DROPOFF_TIME = 1  # heure
    
    def __init__(self, ors_api_key: str):
        self.ors_api_key = ors_api_key
        self.ors_base_url = "https://api.openrouteservice.org"
    
    def geocode_address(self, address: str) -> tuple:
        """Convertir une adresse en coordonnées GPS avec OpenRouteService"""
        url = f"{self.ors_base_url}/geocode/search"
        
        headers = {
            'Authorization': self.ors_api_key,
            'Accept': 'application/json'
        }
        
        params = {
            'text': address,
            'size': 1
        }
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('features') and len(data['features']) > 0:
                coords = data['features'][0]['geometry']['coordinates']
                print(f"Geocoded '{address}' to: {coords}")
                return coords[0], coords[1]  # longitude, latitude
            else:
                print(f"No results for address: {address}")
        except Exception as e:
            print(f"Geocoding error for {address}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}")
                print(f"Response body: {e.response.text}")
        return None, None
    
    def get_route(self, coordinates: List[tuple]) -> Dict:
        """Obtenir l'itinéraire via OpenRouteService Directions API"""
        url = f"{self.ors_base_url}/v2/directions/driving-car/geojson"
        
        headers = {
            'Authorization': self.ors_api_key,
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
        
        # Préparer le corps de la requête avec le bon format
        body = {
            'coordinates': [[coord[0], coord[1]] for coord in coordinates],
            'instructions': False,
            'preference': 'recommended',
            'units': 'mi'
        }
        
        try:
            print(f"Requesting route with coordinates: {body['coordinates']}")
            response = requests.post(url, json=body, headers=headers, timeout=20)
            response.raise_for_status()
            data = response.json()
            
            print("Route calculation successful")
            
            if 'features' in data and len(data['features']) > 0:
                feature = data['features'][0]
                properties = feature['properties']
                
                # Extraire les segments
                if 'segments' in properties and len(properties['segments']) > 0:
                    segment = properties['segments'][0]
                    distance_meters = segment.get('distance', 0)
                    duration_seconds = segment.get('duration', 0)
                else:
                    # Fallback si pas de segments
                    distance_meters = properties.get('summary', {}).get('distance', 0)
                    duration_seconds = properties.get('summary', {}).get('duration', 0)
                
                # Convertir en format similaire à Mapbox pour compatibilité
                return {
                    'routes': [{
                        'geometry': feature['geometry'],
                        'distance': distance_meters,  # en mètres
                        'duration': duration_seconds   # en secondes
                    }]
                }
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error: {e}")
            print(f"Response status: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
        except Exception as e:
            print(f"Routing error: {e}")
        return {}
    
    def calculate_fuel_stops(self, total_distance_miles: float) -> List[Dict]:
        """Calculer les arrêts carburant nécessaires"""
        num_fuel_stops = math.floor(total_distance_miles / self.FUEL_STOP_INTERVAL)
        fuel_stops = []
        
        if num_fuel_stops > 0:
            interval_distance = total_distance_miles / (num_fuel_stops + 1)
            for i in range(1, num_fuel_stops + 1):
                fuel_stops.append({
                    'type': 'fuel',
                    'distance': interval_distance * i,
                    'duration': self.FUEL_STOP_DURATION
                })
        
        return fuel_stops
    
    def calculate_eld_logs(self, current_cycle_used: float, total_distance_miles: float, 
                          total_duration_hours: float) -> List[Dict]:
        """Calculer les logs ELD avec tous les arrêts obligatoires"""
        logs = []
        current_time = datetime.now()
        available_drive_time = self.MAX_DRIVING_TIME
        available_on_duty = self.MAX_ON_DUTY_TIME
        available_cycle = self.MAX_CYCLE_TIME - current_cycle_used
        
        distance_covered = 0
        avg_speed = total_distance_miles / total_duration_hours if total_duration_hours > 0 else 55
        
        current_log = {
            'date': current_time.strftime('%Y-%m-%d'),
            'events': [],
            'total_driving': 0,
            'total_on_duty': 0,
        }
        
        # Événement: Pickup
        current_log['events'].append({
            'time': current_time.strftime('%H:%M'),
            'status': 'ON_DUTY',
            'location': 'Pickup Location',
            'duration': self.PICKUP_DROPOFF_TIME,
            'note': 'Loading cargo'
        })
        current_time += timedelta(hours=self.PICKUP_DROPOFF_TIME)
        current_log['total_on_duty'] += self.PICKUP_DROPOFF_TIME
        available_on_duty -= self.PICKUP_DROPOFF_TIME
        available_cycle -= self.PICKUP_DROPOFF_TIME
        
        # Phase de conduite
        remaining_distance = total_distance_miles
        consecutive_drive_time = 0
        
        while remaining_distance > 0:
            # Vérifier si pause de 30min nécessaire
            if consecutive_drive_time >= 8:
                current_log['events'].append({
                    'time': current_time.strftime('%H:%M'),
                    'status': 'OFF_DUTY',
                    'location': 'Rest Area',
                    'duration': self.REQUIRED_BREAK_TIME,
                    'note': 'Required 30-minute break after 8 hours'
                })
                current_time += timedelta(hours=self.REQUIRED_BREAK_TIME)
                consecutive_drive_time = 0
            
            # Calculer le temps de conduite possible
            drive_time = min(
                available_drive_time,
                available_on_duty,
                8 - consecutive_drive_time,
                remaining_distance / avg_speed
            )
            
            if drive_time <= 0:
                # Repos obligatoire de 10h
                current_log['events'].append({
                    'time': current_time.strftime('%H:%M'),
                    'status': 'SLEEPER_BERTH',
                    'location': 'Rest Stop',
                    'duration': self.REQUIRED_OFF_DUTY,
                    'note': 'Mandatory 10-hour off-duty period'
                })
                logs.append(current_log)
                
                # Nouveau jour
                current_time += timedelta(hours=self.REQUIRED_OFF_DUTY)
                available_drive_time = self.MAX_DRIVING_TIME
                available_on_duty = self.MAX_ON_DUTY_TIME
                consecutive_drive_time = 0
                
                current_log = {
                    'date': current_time.strftime('%Y-%m-%d'),
                    'events': [],
                    'total_driving': 0,
                    'total_on_duty': 0,
                }
                continue
            
            # Événement de conduite
            distance_this_segment = drive_time * avg_speed
            current_log['events'].append({
                'time': current_time.strftime('%H:%M'),
                'status': 'DRIVING',
                'location': f'Mile {int(distance_covered)}',
                'duration': drive_time,
                'distance': distance_this_segment
            })
            
            current_time += timedelta(hours=drive_time)
            distance_covered += distance_this_segment
            remaining_distance -= distance_this_segment
            consecutive_drive_time += drive_time
            available_drive_time -= drive_time
            available_on_duty -= drive_time
            available_cycle -= drive_time
            current_log['total_driving'] += drive_time
            current_log['total_on_duty'] += drive_time
            
            # Arrêt carburant si nécessaire
            if distance_covered % self.FUEL_STOP_INTERVAL < distance_this_segment and remaining_distance > 0:
                current_log['events'].append({
                    'time': current_time.strftime('%H:%M'),
                    'status': 'ON_DUTY',
                    'location': 'Fuel Stop',
                    'duration': self.FUEL_STOP_DURATION,
                    'note': 'Refueling (15 minutes)'
                })
                current_time += timedelta(hours=self.FUEL_STOP_DURATION)
                available_on_duty -= self.FUEL_STOP_DURATION
                current_log['total_on_duty'] += self.FUEL_STOP_DURATION
        
        # Événement: Drop-off
        current_log['events'].append({
            'time': current_time.strftime('%H:%M'),
            'status': 'ON_DUTY',
            'location': 'Drop-off Location',
            'duration': self.PICKUP_DROPOFF_TIME,
            'note': 'Unloading cargo'
        })
        current_log['total_on_duty'] += self.PICKUP_DROPOFF_TIME
        
        logs.append(current_log)
        return logs


def calculate_trip(trip_data: dict, ors_api_key: str) -> dict:
    """Fonction principale de calcul du voyage avec OpenRouteService"""
    calculator = ELDCalculator(ors_api_key)
    
    print(f"Calculating trip from {trip_data['current_location']} -> {trip_data['pickup_location']} -> {trip_data['dropoff_location']}")
    
    # Géocodage des adresses
    current_coords = calculator.geocode_address(trip_data['current_location'])
    pickup_coords = calculator.geocode_address(trip_data['pickup_location'])
    dropoff_coords = calculator.geocode_address(trip_data['dropoff_location'])
    
    if None in [current_coords[0], pickup_coords[0], dropoff_coords[0]]:
        return {'error': 'Unable to geocode one or more addresses. Please verify the locations and ensure they are valid city names or addresses.'}
    
    # Obtenir l'itinéraire
    route_coords = [current_coords, pickup_coords, dropoff_coords]
    route_data = calculator.get_route(route_coords)
    
    if 'routes' not in route_data or not route_data['routes']:
        return {'error': 'Unable to calculate route. This could be due to: 1) Invalid API key, 2) Rate limit exceeded (2000 requests/day), 3) Invalid coordinates. Please check your ORS API key configuration.'}
    
    route = route_data['routes'][0]
    total_distance_meters = route['distance']
    total_distance_miles = total_distance_meters * 0.000621371
    total_duration_hours = route['duration'] / 3600
    
    print(f"Route calculated: {total_distance_miles:.2f} miles, {total_duration_hours:.2f} hours")
    
    # Calculer les logs ELD
    eld_logs = calculator.calculate_eld_logs(
        trip_data['current_cycle_used'],
        total_distance_miles,
        total_duration_hours
    )
    
    # Calculer arrêts carburant
    fuel_stops = calculator.calculate_fuel_stops(total_distance_miles)
    
    return {
        'route': {
            'geometry': route['geometry'],
            'distance_miles': round(total_distance_miles, 2),
            'duration_hours': round(total_duration_hours, 2),
            'coordinates': route_coords
        },
        'eld_logs': eld_logs,
        'fuel_stops': fuel_stops,
        'summary': {
            'total_days': len(eld_logs),
            'total_driving_hours': round(sum(log['total_driving'] for log in eld_logs), 2),
            'total_on_duty_hours': round(sum(log['total_on_duty'] for log in eld_logs), 2),
        }
    }