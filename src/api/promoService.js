import apiClient from '../services/apiClient';

export const getPromos = async () => {
  try {
    const response = await apiClient.get('/api/v1/promos');
    return response.data;
  } catch (error) {
    console.error('Error fetching promos:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getPromoById = async (promoId) => {
  try {
    const response = await apiClient.get(`/api/v1/promo/${promoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching promo ${promoId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const validatePromoCode = async (promoCode, currentTotal = 0) => {
  try {
    // Get all promos and validate locally since there's no direct validation endpoint
    const response = await apiClient.get('/api/v1/promos');
    const promos = response.data?.data || [];
    
    // Find the promo code
    const foundPromo = promos.find(promo => 
      promo.promo_code?.toLowerCase() === promoCode.toLowerCase() && 
      promo.is_active
    );

    if (!foundPromo) {
      throw new Error('Invalid or inactive promo code');
    }

    // Check if promo is expired
    const now = new Date();
    const startDate = new Date(foundPromo.start_date);
    const endDate = new Date(foundPromo.end_date);

    if (now < startDate) {
      throw new Error('Promo code is not yet active');
    }

    if (now > endDate) {
      throw new Error('Promo code has expired');
    }

    // Check minimum purchase requirement
    if (foundPromo.minimum_claim_price && currentTotal < foundPromo.minimum_claim_price) {
      throw new Error(`Minimum purchase of $${foundPromo.minimum_claim_price.toLocaleString()} required`);
    }

    // Calculate discount
    const discountAmount = foundPromo.promo_discount_price || 0;
    const finalTotal = Math.max(0, currentTotal - discountAmount);

    return {
      promo: foundPromo,
      discountAmount,
      finalTotal,
      isValid: true
    };

  } catch (error) {
    console.error('Error validating promo code:', error.message);
    throw error;
  }
};

export const createPromo = async (promoData) => {
  try {
    const response = await apiClient.post('/api/v1/create-promo', promoData);
    return response.data;
  } catch (error) {
    console.error('Error creating promo:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updatePromo = async (promoId, promoData) => {
  try {
    const response = await apiClient.post(`/api/v1/update-promo/${promoId}`, promoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating promo ${promoId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deletePromo = async (promoId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-promo/${promoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting promo ${promoId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
