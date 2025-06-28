import apiClient from '../services/apiClient';

export const getBanners = async () => {
  try {
    const response = await apiClient.get('/api/v1/banners');
    return response.data;
    
  } catch (error) {
    console.error('Error fetching banners:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getBannerById = async (bannerId) => {
  try {
    const response = await apiClient.get(`/api/v1/banner/${bannerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching banner ${bannerId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const createBanner = async (bannerData) => {
  try {
    const response = await apiClient.post('/api/v1/create-banner', bannerData);
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateBanner = async (bannerId, bannerData) => {
  try {
    const response = await apiClient.post(`/api/v1/update-banner/${bannerId}`, bannerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating banner ${bannerId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-banner/${bannerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting banner ${bannerId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};