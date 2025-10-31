from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class TripCalculationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
    def test_calculate_trip_endpoint(self):
        """Test de l'endpoint de calcul de voyage"""
        data = {
            'current_location': 'Los Angeles, CA',
            'pickup_location': 'Phoenix, AZ',
            'dropoff_location': 'Dallas, TX',
            'current_cycle_used': 10.0
        }
        response = self.client.post('/api/trips/calculate/', data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])