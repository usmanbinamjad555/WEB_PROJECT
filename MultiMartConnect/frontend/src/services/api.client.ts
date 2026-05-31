import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export const apiClient = axios.create({
  // Connecting automatically across localized multi-tenant networks pointing to backend Port 8000
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      const pathSegments = window.location.pathname.split('/');
      
      const tenantContext = currentHost.includes('localhost') 
        ? (pathSegments[1] || 'default-tenant')
        : currentHost.split('.')[0];
        
      config.headers['x-tenant-id'] = tenantContext;
    }

    const accessKey = useAuthStore.getState().accessToken;
    if (accessKey) {
      config.headers.Authorization = `Bearer ${accessKey}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const fallbackBase = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api/v1';
        const rotationResponse = await axios.post(
          `${fallbackBase}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const freshKey = rotationResponse.data.accessToken;
        
        useAuthStore.getState().setAccessToken(freshKey);
        originalRequest.headers.Authorization = `Bearer ${freshKey}`;
        
        return apiClient(originalRequest);
      } catch (rotationError) {
        useAuthStore.getState().clearSession();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(rotationError);
      }
    }
    return Promise.reject(error);
  }
);