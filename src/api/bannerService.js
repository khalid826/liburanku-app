import apiClient from '../services/apiClient';

export const getBanners = async () => {
  try {
    const response = await apiClient.get('/banners');
    return response.data;
    
  } catch (error) {
    console.error('Error fetching banners:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};