import apiClient from '../services/apiClient';

export const getMyTransactions = async () => {
  try {
    const response = await apiClient.get('/api/v1/my-transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching my transactions:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await apiClient.get('/api/v1/all-transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching all transactions:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const response = await apiClient.get(`/api/v1/transaction/${transactionId}`);
    console.log('Transaction detail response:', response);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error.response?.data || error.message);
    console.error('Full error response:', error.response);
    throw error.response?.data || error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await apiClient.post('/api/v1/create-transaction', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error.response?.data || error.message);
    console.error('Full error response:', error.response);
    console.error('Request data sent:', transactionData);
    throw error.response?.data || error;
  }
};

export const cancelTransaction = async (transactionId) => {
  try {
    const response = await apiClient.post(`/api/v1/cancel-transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling transaction ${transactionId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateTransactionProofPayment = async (transactionId, proofPaymentUrl) => {
  try {
    const response = await apiClient.post(`/api/v1/update-transaction-proof-payment/${transactionId}`, {
      proofPaymentUrl
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction proof payment ${transactionId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const response = await apiClient.post(`/api/v1/update-transaction-status/${transactionId}`, {
      status: status
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction status ${transactionId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
