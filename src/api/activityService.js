import apiClient from '../services/apiClient';

export const getActivities = async () => {
  try {
    const response = await apiClient.get('/api/v1/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getActivityById = async (activityId) => {
  try {
    const response = await apiClient.get(`/api/v1/activity/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity ${activityId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getActivitiesByCategoryId = async (categoryId) => {
  try {
    const response = await apiClient.get(`/api/v1/activities-by-category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities for category ${categoryId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};