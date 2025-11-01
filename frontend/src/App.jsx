import React, { useState } from 'react';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import ELDLogs from './components/ELDLogs';
import { calculateTrip } from './services/api';
import { Truck, AlertCircle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripResult, setTripResult] = useState(null);

  const handleSubmit = async (tripData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await calculateTrip(tripData);
      setTripResult(result);
    } catch (err) {
      setError(err.message || 'Failed to calculate trip. Please try again.');
      console.error('Trip calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ELD Trip Planner
              </h1>
              <p className="mt-1 text-sm text-gray-600">
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-600 text-sm underline mt-1 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <TripForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {loading && (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 font-medium">Calculating optimal route...</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Processing trip data and ELD regulations
                  </p>
                </div>
              </div>
            )}

            {tripResult && !loading && (
              <>
                <MapView routeData={tripResult.route} />
                <ELDLogs 
                  logs={tripResult.eld_logs} 
                  summary={tripResult.summary}
                  fuelStops={tripResult.fuel_stops}
                />
              </>
            )}

            {!tripResult && !loading && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Truck className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Plan Your Trip
                </h3>
                <p className="text-gray-500">
                  Enter trip details on the left to generate your route and ELD compliance logs
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 ELD Trip Planner - FMCSA Compliant Routing System
            </p>
            <p className="text-xs text-gray-400 mt-2 md:mt-0">
              Powered by OpenRouteService & OpenStreetMap
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
