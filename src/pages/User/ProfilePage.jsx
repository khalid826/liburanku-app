import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { userService } from '../../api';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ImageUploader from '../../components/UI/ImageUploader';
import { User, Mail, Phone, Camera, Save, Edit, X } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePictureUrl: user?.profilePictureUrl || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        profilePictureUrl: user.profilePictureUrl || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile(formData);
      if (response && response.data) {
        setUser(response.data); // Update user in context
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      profilePictureUrl: user?.profilePictureUrl || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || ''
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePictureUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <User size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/128x128/EBF4FF/76A9FA?text=User';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById('profile-picture-input').click()}
                  className="absolute bottom-0 right-0 bg-[#0B7582] text-white p-2 rounded-full hover:bg-[#095e68] transition-colors"
                >
                  <Camera size={16} />
                </button>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {user?.name || 'User Name'}
                </h2>
                <p className="text-gray-600 mb-2">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {/* Edit Button */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68] disabled:opacity-50 transition-colors text-sm sm:text-base"
                    >
                      {loading ? (
                        <Loader size="sm" />
                      ) : (
                        <>
                          <Save size={16} className="sm:w-4 sm:h-4 mr-2" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      <X size={16} className="sm:w-4 sm:h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68] transition-colors text-sm sm:text-base"
                  >
                    <Edit size={16} className="sm:w-4 sm:h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;