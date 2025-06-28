import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import BannerForm from '../../components/Banner/BannerForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';

const BannerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const { bannerService } = await import('../../api');
      const response = await bannerService.getBannerById(id);
      
      if (response?.data) {
        setBanner(response.data);
      } else {
        setError('Banner not found');
      }
    } catch (err) {
      setError('Failed to load banner');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { bannerService } = await import('../../api');
      await bannerService.updateBanner(id, data);
      navigate('/admin/banners', { 
        state: { message: 'Banner updated successfully!' }
      });
    } catch (err) {
      setError('Failed to update banner');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/banners');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Banner">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error && !banner) {
    return (
      <AdminLayout title="Edit Banner">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="outline">
            Back to Banners
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Banner">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BannerForm
          initialValues={banner}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Update Banner"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default BannerEditPage; 