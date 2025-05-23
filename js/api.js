/**
 * Service pour gérer les appels API vers le backend Flask
 */
import axios from 'axios';
import config from './config';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: config.API_URL,
  ...config.requestConfig
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services API
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(config.endpoints.auth.login, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(config.endpoints.auth.register, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
    }
  }
};

export const zonesService = {
  getAll: async () => {
    try {
      const response = await api.get(config.endpoints.zones);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des zones');
    }
  },

  getById: async (zoneId) => {
    try {
      const response = await api.get(`${config.endpoints.zones}/${zoneId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la zone');
    }
  }
};

export const platformsService = {
  getByZone: async (zoneId) => {
    try {
      const response = await api.get(`${config.endpoints.platforms}?zone=${zoneId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des plateformes');
    }
  }
};

export const pidsService = {
  getByPlatform: async (platformId) => {
    try {
      const response = await api.get(`${config.endpoints.pids}?platform=${platformId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des PIDs');
    }
  },

  update: async (pidId, data) => {
    try {
      const response = await api.put(`${config.endpoints.pids}/${pidId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du PID');
    }
  }
};

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get(config.endpoints.dashboard);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
  }
};