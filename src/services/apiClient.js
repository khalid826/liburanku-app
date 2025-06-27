import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://travel-journal-api-bootcamp.do.dibimbing.id',
  headers: {
    apiKey: import.meta.env.VITE_API_KEY || '24405e01-fbc1-45a5-9f5a-be13afcd757c',
    'Content-Type': 'application/json'
  }
});

// Interceptor to add JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global response errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('authToken');

      // Optionally dispatch logout event
      const logoutEvent = new Event('force-logout');
      window.dispatchEvent(logoutEvent);

      // Optionally redirect to login page (uncomment if needed)
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
