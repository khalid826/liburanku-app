import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import BannerForm from '../../components/Banner/BannerForm';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/UI/ErrorMessage';

const BannerCreatePage = () => {
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { bannerService } = await import('../../api');
      await bannerService.createBanner(data);
      navigate('/admin/banners', { 
        state: { message: 'Banner created successfully!' }
      });
    } catch (err) {
      setError('Failed to create banner');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/banners');
  };

  return (
    <AdminLayout title="Create Banner">
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
            Back to Banners
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Banner</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BannerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Create Banner"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default BannerCreatePage; 