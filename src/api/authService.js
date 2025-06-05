import apiClient from '../services/apiClient';

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/v1/register', userData);
    return response.data;

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/api/v1/login', credentials);
    return response.data;

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.get('/api/v1/logout');
    return response.data;

  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getLoggedUser = async () => {
  try {
    const response = await apiClient.get('/api/v1/user');
    return response.data;

  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.post('/api/v1/update-profile', profileData);
    return response.data;

  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};