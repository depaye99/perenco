/**
 * Configuration globale de l'application
 * À adapter selon l'environnement (dev/prod)
 */
const config = {
  // URL de base de l'API Flask
  API_URL: 'http://localhost:5000/api',
  
  // Points d'entrée de l'API
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout'
    },
    zones: '/zones',
    platforms: '/platforms',
    pids: '/pids',
    dashboard: '/dashboard'
  },
  
  // Configuration des requêtes
  requestConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 5000
  }
};

export default config;