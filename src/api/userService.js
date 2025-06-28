import apiClient from '../services/apiClient';

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/v1/all-user');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/api/v1/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/v1/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/api/v1/update-user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.post(`/api/v1/update-user-role/${userId}`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating user role ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.post('/api/v1/update-profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
