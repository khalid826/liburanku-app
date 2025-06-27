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

export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post('/api/v1/create-category', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await apiClient.post(`/api/v1/update-category/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};