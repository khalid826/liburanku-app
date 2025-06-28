import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import UserForm from '../../components/User/UserForm';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';

const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { userService } = await import('../../api');
      const response = await userService.getUserById(id);
      if (response?.data) {
        setUser(response.data);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { userService } = await import('../../api');
      await userService.updateUser(id, data);
      navigate('/admin/users', { 
        state: { message: 'User updated successfully!' }
      });
    } catch (err) {
      setError('Failed to update user');
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit User">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error && !user) {
    return (
      <AdminLayout title="Edit User">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ErrorMessage message={error} />
          <Button onClick={handleCancel} variant="outline">
            Back to Users
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit User">
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
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <UserForm
          initialValues={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          submitButtonText="Update User"
          submitButtonIcon={<Save size={16} />}
        />
      </div>
    </AdminLayout>
  );
};

export default UserEditPage; 