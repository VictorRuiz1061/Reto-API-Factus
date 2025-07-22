import axios from 'axios';

// Cliente para realizar peticiones a la API de Factus
const api = axios.create({
  baseURL: `https://api-sandbox.factus.com.co/v1/`,
});

// Interceptor para añadir el token de autenticación a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
