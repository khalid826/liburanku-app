import apiClient from '../services/apiClient';

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post('/api/v1/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
