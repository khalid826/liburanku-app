import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import PromoForm from '../../components/Promo/PromoForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';

const PromoEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPromo();
  }, [id]);

  const fetchPromo = async () => {
    try {
      setLoading(true);
      const { promoService } = await import('../../api');
      const response = await promoService.getPromoById(id);
      
      if (response?.data) {
        setPromo(response.data);
      } else {
        setError('Promo not found');
      }
    } catch (err) {
      setError('Failed to load promo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { promoService } = await import('../../api');
      await promoService.updatePromo(id, data);
      navigate('/admin/promos', { 
        state: { message: 'Promo updated successfully!' }
      });
    } catch (err) {
      setError('Failed to update promo');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/promos');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Promo">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error && !promo) {
    return (
      <AdminLayout title="Edit Promo">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="outline">
            Back to Promos
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Promo">
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
            Back to Promos
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Promo</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <PromoForm
          initialValues={promo}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Update Promo"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default PromoEditPage; 