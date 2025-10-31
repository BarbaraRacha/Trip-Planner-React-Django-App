import axios from 'axios';
import { API_BASE_URL, APP_CONFIG } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

/**
 * Calculer un voyage avec logs ELD
 * @param {Object} tripData - Données du voyage
 * @returns {Promise} - Résultat du calcul
 */
export const calculateTrip = async (tripData) => {
  try {
    const response = await api.post('/api/trips/calculate/', tripData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to calculate trip';
    throw new Error(errorMessage);
  }
};

export default api;