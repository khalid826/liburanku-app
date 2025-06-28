import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import ActivityForm from '../../components/Activity/ActivityForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { activityService, categoryService } from '../../api';

const ActivityEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activityRes, categoriesRes] = await Promise.all([
        activityService.getActivityById(id),
        categoryService.getCategories()
      ]);

      if (activityRes?.data) {
        setActivity(activityRes.data);
      } else {
        setError('Activity not found');
      }

      if (categoriesRes?.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
      setError('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      await activityService.updateActivity(id, data);
      navigate('/admin/activities', { 
        state: { message: 'Activity updated successfully!' }
      });
    } catch (err) {
      setError('Failed to update activity');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/activities');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Activity">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error && !activity) {
    return (
      <AdminLayout title="Edit Activity">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="outline">
            Back to Activities
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Activity">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ActivityForm
          categories={categories}
          initialValues={activity}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      </div>
    </AdminLayout>
  );
};

export default ActivityEditPage; 