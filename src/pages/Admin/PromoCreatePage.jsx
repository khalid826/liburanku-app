import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import PromoForm from '../../components/Promo/PromoForm';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/UI/ErrorMessage';

const PromoCreatePage = () => {
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { promoService } = await import('../../api');
      await promoService.createPromo(data);
      navigate('/admin/promos', { 
        state: { message: 'Promo created successfully!' }
      });
    } catch (err) {
      setError('Failed to create promo');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/promos');
  };

  return (
    <AdminLayout title="Create Promo">
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Promo</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <PromoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Create Promo"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default PromoCreatePage; 