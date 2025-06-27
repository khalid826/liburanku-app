import apiClient from '../services/apiClient';

export const getCartItems = async () => {
  try {
    const response = await apiClient.get('/api/v1/carts');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const addToCart = async (activityId) => {
  try {
    // API expects { "activityId": "..." }
    const response = await apiClient.post('/api/v1/add-cart', { activityId });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateCartItem = async (cartId, quantity) => {
  try {
    const response = await apiClient.post(`/api/v1/update-cart/${cartId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error(`Error updating cart item ${cartId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteCartItem = async (cartId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-cart/${cartId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting cart item ${cartId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};