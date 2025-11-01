export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rachab.pythonanywhere.com';
export const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY || '';

// Validation de la clé ORS
export const isORSConfigured = () => {
  return ORS_API_KEY && ORS_API_KEY !== '' && ORS_API_KEY.length > 20;
};

// Configuration de l'application
export const APP_CONFIG = {
  name: 'ELD Trip Planner',
  version: '1.0.0',
  apiTimeout: 30000, // 30 secondes
  mapDefaultZoom: 5,
  mapStyle: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap gratuit
};
