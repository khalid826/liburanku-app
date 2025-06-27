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

export const createActivity = async (activityData) => {
  try {
    const response = await apiClient.post('/api/v1/create-activity', activityData);
    return response.data;
  } catch (error) {
    console.error('Error creating activity:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await apiClient.post(`/api/v1/update-activity/${activityId}`, activityData);
    return response.data;
  } catch (error) {
    console.error(`Error updating activity ${activityId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteActivity = async (activityId) => {
  try {
    const response = await apiClient.delete(`/api/v1/delete-activity/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting activity ${activityId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};