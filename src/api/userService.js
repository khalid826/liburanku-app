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

export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.post(`/api/v1/update-user-role/${userId}`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating user role ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
