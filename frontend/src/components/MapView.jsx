import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Créer des icônes personnalisées
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="custom-marker-icon" style="background-color: ${color};">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const MapView = ({ routeData }) => {
  if (!routeData || !routeData.coordinates) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">No route data available</p>
      </div>
    );
  }

  const { coordinates, distance_miles, duration_hours, geometry } = routeData;

  // Convertir les coordonnées pour Leaflet (lat, lng au lieu de lng, lat)
  const positions = coordinates.map(coord => [coord[1], coord[0]]);

  // Extraire les points de la géométrie pour tracer la route
  let routePoints = [];
  if (geometry && geometry.coordinates) {
    routePoints = geometry.coordinates.map(coord => [coord[1], coord[0]]);
  }

  // Calculer le centre de la carte
  const center = positions[0] || [39.8283, -98.5795]; // Centre des USA par défaut

  const markers = [
    { position: positions[0], label: '1', color: '#EF4444', title: 'Current Location' },
    { position: positions[1], label: '2', color: '#F59E0B', title: 'Pickup Location' },
    { position: positions[2], label: '3', color: '#10B981', title: 'Drop-off Location' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Route Map
            </h2>
            <div className="mt-2 flex items-center space-x-4 text-sm text-indigo-100">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {distance_miles} miles
              </span>
              <span>•</span>
              <span>{duration_hours.toFixed(1)} hours (driving time)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Tracer la route si disponible */}
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#4F46E5',
                weight: 5,
                opacity: 0.7
              }}
            />
          )}

          {/* Marqueurs pour chaque point */}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={createCustomIcon(marker.color, marker.label)}
            >
              <Popup>
                <div className="text-center">
                  <strong className="text-gray-900">{marker.title}</strong>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-gray-700">Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-gray-700">Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700">Drop-off</span>
            </div>
          </div>
          <span className="text-gray-500 text-xs">
            Powered by OpenStreetMap
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapView;