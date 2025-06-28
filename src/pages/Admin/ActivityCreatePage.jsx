import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import ActivityForm from '../../components/Activity/ActivityForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { activityService, categoryService } from '../../api';

const ActivityCreatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    // Test API connectivity
    testApiConnection();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    try {
      const response = await activityService.getActivities();
      console.log('API connection test - existing activities:', response);
    } catch (err) {
      console.error('API connection test failed:', err);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      console.log('Creating activity with data:', data);
      const response = await activityService.createActivity(data);
      console.log('Activity created successfully:', response);
      navigate('/admin/activities', { 
        state: { message: 'Activity created successfully!' }
      });
    } catch (err) {
      console.error('Error creating activity:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      if (err.errors && Array.isArray(err.errors)) {
        // Show specific validation errors from API
        const errorMessages = err.errors.map(error => {
          console.log('Individual error:', error);
          return error.message || error.field || JSON.stringify(error);
        }).join(', ');
        setError(`Validation errors: ${errorMessages}`);
      } else {
        setError(err.message || 'Failed to create activity');
      }
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/activities');
  };

  if (loading) {
    return (
      <AdminLayout title="Create Activity">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Create Activity">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Activities
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Activity</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ActivityForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      </div>
    </AdminLayout>
  );
};

export default ActivityCreatePage; 