import { useAuth } from '../../context/AuthContext';
import { useEffect, useState as useStateProfile } from 'react';
import { authService as authServiceProfile } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { UserCircle as UserCircleIcon, Mail as MailIconProfile, Phone as PhoneIconProfile, Edit3 } from 'lucide-react';

const ProfilePage = () => {
  const { user: authUser, token, setUser: setAuthUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useStateProfile(null);
  const [loading, setLoading] = useStateProfile(true);
  const [error, setError] = useStateProfile(null);

  // Form state for editing
  const [isEditing, setIsEditing] = useStateProfile(false);
  const [editFormData, setEditFormData] = useStateProfile({
    name: '', // Check API
    email: '', // Check API
    phoneNumber: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser && token) { // If user data already in context
        setProfileData(authUser);
        setEditFormData({
            name: authUser.name || '',
            email: authUser.email || '',
            phoneNumber: authUser.phoneNumber || '',
            profilePictureUrl: authUser.profilePictureUrl || '',
        });
        setLoading(false);

      } else if (token) { // If only token, fetch user data
        try {
          setLoading(true);
          const response = await authServiceProfile.getLoggedUser();

          if (response && response.data) {
            setProfileData(response.data);
            setAuthUser(response.data); // Update context
            setEditFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                profilePictureUrl: response.data.profilePictureUrl || '',
            });

          } else {
            setError("Could not fetch profile data.");
          }

        } catch (err) {
          setError(err.message || "Failed to load profile.");
          console.error("Profile fetch error:", err);

        } finally {
          setLoading(false);
        }

      } else {
         setLoading(false); // No token, nothing to load
      }
    };

    if(!authLoading) { // Ensure auth context has finished its initial loading
        fetchUserProfile();
    }
  }, [authUser, token, setAuthUser, authLoading]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Call API to update profile
    try {
        setLoading(true);
        setError(null);
        const updatedData = await authServiceProfile.updateProfile(editFormData);
        
        if (updatedData && updatedData.data) {
            setProfileData(updatedData.data);
            setAuthUser(updatedData.data); // Update context

        } else {
            // If API doesn't return updated user, merge local changes
            const locallyUpdatedUser = { ...profileData, ...editFormData };
            setProfileData(locallyUpdatedUser);
            setAuthUser(locallyUpdatedUser);
        }

        alert("Profile updated successfully!");
        setIsEditing(false);

    } catch (err) {
        setError(err.message || "Failed to update profile.");

    } finally {
        setLoading(false);
    }
  }

  if (loading || authLoading) return <div className="flex justify-center items-center h-64"><Loader /></div>;
  if (error) return <ErrorMessage message={error} onClose={() => setError(null)} />;
  if (!profileData && !token) return <p className="text-center text-gray-600">Please log in to view your profile.</p>;
  if (!profileData && token) return <p className="text-center text-gray-600">Could not load profile data.</p>;


  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>

        {!isEditing && (
             <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Edit3 size={18} className="mr-1" /> Edit Profile
            </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="email_edit" className="block text-sm font-medium text-gray-700">Email (read-only)</label>
                <input
                  type="email"
                  name="email"
                  id="email_edit"
                  value={editFormData.email} readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="profilePictureUrl_edit" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                <input type="url"
                  name="profilePictureUrl"
                  id="profilePictureUrl_edit"
                  value={editFormData.profilePictureUrl}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? <Loader size="sm" /> : 'Save Changes'}
                </button>
            </div>
        </form>

      ) : (
        <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
            <img 
                src={profileData.profilePictureUrl || 'https://placehold.co/150x150/EBF4FF/76A9FA?text=User'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/EBF4FF/76A9FA?text=User"; }}
            />
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg text-gray-900 flex items-center">
                  <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {profileData.name || 'Not Provided'}
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-lg text-gray-900 flex items-center">
                  <MailIconProfile className="h-5 w-5 text-gray-400 mr-2" />
                  {profileData.email}
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-lg text-gray-900 flex items-center">
                  <PhoneIconProfile className="h-5 w-5 text-gray-400 mr-2" />
                  {profileData.phoneNumber || 'Not Provided'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg text-gray-900 capitalize">{profileData.role || 'User'}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;