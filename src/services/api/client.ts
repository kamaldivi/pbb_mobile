import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log API requests in development
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Log detailed error information
      const errorMsg = error.response.data?.detail || error.response.data?.message || 'Unknown error';
      console.error(`[API Error] ${error.response.status} ${error.config.url}:`, errorMsg);
    } else if (error.request) {
      console.error('[API Error] No response received from server');
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
