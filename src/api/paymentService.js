import apiClient from '../services/apiClient';

export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/api/v1/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const generatePaymentMethods = async () => {
  try {
    const response = await apiClient.post('/api/v1/generate-payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error generating payment methods:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
