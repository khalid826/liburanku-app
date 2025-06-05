import apiClient from '../services/apiClient';

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/v1/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getCategoryById = async (categoryId) => {
    try {
      const response = await apiClient.get(`/api/v1/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };