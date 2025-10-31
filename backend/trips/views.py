from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripInputSerializer
from .services import calculate_trip
from decouple import config

class TripCalculationView(APIView):
    """API endpoint pour calculer un voyage avec logs ELD - Utilise OpenRouteService"""
    
    def post(self, request):
        serializer = TripInputSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        ors_api_key = config('ORS_API_KEY')
        
        if not ors_api_key or ors_api_key == '5b3ce3597851110001cf6248YOUR_KEY_HERE':
            return Response(
                {'error': 'OpenRouteService API key not configured. Please add ORS_API_KEY to .env file. Get free key at: https://openrouteservice.org/dev/#/signup'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            result = calculate_trip(serializer.validated_data, ors_api_key)
            
            if 'error' in result:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )