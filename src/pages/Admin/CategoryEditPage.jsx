import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import CategoryForm from '../../components/Category/CategoryForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';

const CategoryEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const { categoryService } = await import('../../api');
      const response = await categoryService.getCategoryById(id);
      
      if (response?.data) {
        setCategory(response.data);
      } else {
        setError('Category not found');
      }
    } catch (err) {
      setError('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { categoryService } = await import('../../api');
      await categoryService.updateCategory(id, data);
      navigate('/admin/categories', { 
        state: { message: 'Category updated successfully!' }
      });
    } catch (err) {
      setError('Failed to update category');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Category">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error && !category) {
    return (
      <AdminLayout title="Edit Category">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="outline">
            Back to Categories
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Category">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CategoryForm
          initialValues={category}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Update Category"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryEditPage; 