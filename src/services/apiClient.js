import axios from 'axios';

// const BASE_URL = 'https://travel-journal-api-bootcamp.do.dibimbing.id'; 
// const API_KEY = '24405e01-fbc1-45a5-9f5a-be13afcd757c';

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'apiKey': API_KEY,
//   },
// });

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    apiKey: import.meta.env.VITE_API_KEY,
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

export default apiClient;
