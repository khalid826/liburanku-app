import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import CategoryForm from '../../components/Category/CategoryForm';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/UI/ErrorMessage';

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      // Import categoryService here to avoid circular dependency
      const { categoryService } = await import('../../api');
      await categoryService.createCategory(data);
      navigate('/admin/categories', { 
        state: { message: 'Category created successfully!' }
      });
    } catch (err) {
      setError('Failed to create category');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  return (
    <AdminLayout title="Create Category">
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
            Back to Categories
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Create Category"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryCreatePage; 