import React from 'react';
import { Clock, MapPin, Fuel, Moon, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

const ELDLogs = ({ logs, summary, fuelStops }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'DRIVING': return <MapPin className="h-4 w-4" />;
      case 'ON_DUTY': return <Clock className="h-4 w-4" />;
      case 'SLEEPER_BERTH': return <Moon className="h-4 w-4" />;
      case 'OFF_DUTY': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DRIVING': return 'bg-green-100 text-green-800 border-green-300';
      case 'ON_DUTY': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'SLEEPER_BERTH': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'OFF_DUTY': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBarColor = (status) => {
    switch(status) {
      case 'DRIVING': return 'bg-green-500';
      case 'ON_DUTY': return 'bg-yellow-500';
      case 'SLEEPER_BERTH': return 'bg-blue-500';
      case 'OFF_DUTY': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
          Trip Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-indigo-600 font-medium">Total Days</p>
              <Calendar className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold text-indigo-900">{summary.total_days}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-600 font-medium">Driving Hours</p>
              <MapPin className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {summary.total_driving_hours.toFixed(1)}h
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-yellow-600 font-medium">On-Duty Hours</p>
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {summary.total_on_duty_hours.toFixed(1)}h
            </p>
          </div>
        </div>

        {fuelStops && fuelStops.length > 0 && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center mb-2">
              <Fuel className="h-5 w-5 text-orange-600 mr-2" />
              <p className="text-sm font-semibold text-orange-900">
                Fuel Stops Required: {fuelStops.length}
              </p>
            </div>
            <p className="text-xs text-orange-700">
              Approximately every 1,000 miles • 15 minutes each stop
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Compliance Note:</strong> All logs comply with FMCSA Hours of Service (HOS) 
            regulations for property-carrying drivers. Ensure all rest periods and breaks are 
            taken as indicated.
          </p>
        </div>
      </div>

      {/* Daily Logs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-indigo-600" />
          Daily ELD Logs
        </h2>
        
        {logs.map((log, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Day Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h3 className="text-lg font-bold text-white">
                Day {dayIndex + 1} - {new Date(log.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-indigo-100">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Driving: {log.total_driving.toFixed(1)}h
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  On-Duty: {log.total_on_duty.toFixed(1)}h
                </span>
                <span>•</span>
                <span>{log.events.length} events</span>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2 font-medium">24-Hour Timeline:</p>
              <div className="relative h-20 bg-white rounded border border-gray-200 overflow-hidden">
                {/* Hour markers */}
                <div className="absolute inset-0 flex">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 border-r border-gray-100 relative"
                    >
                      {i % 4 === 0 && (
                        <span className="text-xs text-gray-400 absolute -bottom-6 left-0">
                          {i}:00
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status bars */}
                {log.events.map((event, eventIndex) => {
                  const [hours, minutes] = event.time.split(':').map(Number);
                  const startHour = hours + minutes / 60;
                  const duration = event.duration;
                  const width = (duration / 24) * 100;
                  const left = (startHour / 24) * 100;

                  return (
                    <div
                      key={eventIndex}
                      className={`absolute h-12 ${getStatusBarColor(event.status)} opacity-80 rounded cursor-pointer hover:opacity-100 transition`}
                      style={{
                        left: `${Math.min(left, 100)}%`,
                        width: `${Math.min(width, 100 - left)}%`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      title={`${event.status} - ${event.duration.toFixed(2)}h at ${event.location}`}
                    >
                      {width > 3 && (
                        <span className="text-white text-xs font-bold px-1 truncate block leading-loose">
                          {event.status.split('_')[0]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Detailed Events:</p>
              <div className="space-y-2">
                {log.events.map((event, eventIndex) => (
                  <div 
                    key={eventIndex}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${getStatusColor(event.status)}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-semibold text-sm">
                          {event.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-xs mt-1 opacity-80 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                      {event.note && (
                        <p className="text-xs mt-1 italic opacity-70 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {event.note}
                        </p>
                      )}
                      <div className="flex items-center space-x-3 mt-2 text-xs">
                        <span className="bg-white px-2 py-1 rounded">
                          Duration: {event.duration.toFixed(2)}h
                        </span>
                        {event.distance && (
                          <span className="bg-white px-2 py-1 rounded">
                            Distance: {event.distance.toFixed(1)} mi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Footer */}
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Day {dayIndex + 1} Complete</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Total: {(log.total_on_duty).toFixed(1)} hours on-duty
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Status Legend:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-700">Driving</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-700">On-Duty (Not Driving)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-700">Sleeper Berth</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-xs text-gray-700">Off-Duty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELDLogs;