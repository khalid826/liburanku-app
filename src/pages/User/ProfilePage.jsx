import { useEffect, useState as useStateProfile } from 'react'; 
import { useAuth as useAuthProfile } from '../../context/AuthContext'; // Aliased
import { authService as authServiceProfile } from '../../api'; 
import Loader from '../../components/UI/Loader'; // Already imported
import ErrorMessage from '../../components/UI/ErrorMessage'; // Already imported
import { UserCircle as UserCircleIcon, Mail as MailIconProfile, Phone as PhoneIconProfile, Edit3, Image as ImageIconProfile } from 'lucide-react'; 

const ProfilePage = () => {
  const { user: authUser, token, setUser: setAuthUser, loading: authLoadingHook } = useAuthProfile(); // Renamed loading
  const [profileData, setProfileData] = useStateProfile(null);
  const [loading, setLoading] = useStateProfile(true); // Page specific loading
  const [error, setError] = useStateProfile(null);
  const [isEditing, setIsEditing] = useStateProfile(false);
  const [editFormData, setEditFormData] = useStateProfile({
    name: '',
    email: '', 
    phoneNumber: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Use authUser from context if available and not empty
      if (authUser && Object.keys(authUser).length > 0 && token) {
        setProfileData(authUser);
        setEditFormData({
            name: authUser.name || '',
            email: authUser.email || '',
            phoneNumber: authUser.phoneNumber || '',
            profilePictureUrl: authUser.profilePictureUrl || '',
        });
        setLoading(false);
      } else if (token) { 
        try {
          setLoading(true); // Set loading true before fetch
          setError(null); // Clear previous errors
          const response = await authServiceProfile.getLoggedUser();
          if (response && response.data) {
            setProfileData(response.data);
            setAuthUser(response.data); 
            setEditFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                profilePictureUrl: response.data.profilePictureUrl || '',
            });
          } else {
            setError("Could not fetch profile data. Response was empty.");
          }
        } catch (err) {
          setError(err.message || "Failed to load profile.");
          console.error("Profile fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
         setLoading(false); 
      }
    };

    if(!authLoadingHook) { 
        fetchUserProfile();
    }
  }, [authUser, token, setAuthUser, authLoadingHook]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        // Email is part of the payload for update-profile endpoint as per Postman
        const payload = {
            name: editFormData.name,
            email: editFormData.email, // Keep email, even if read-only in form, API might need it
            phoneNumber: editFormData.phoneNumber,
            profilePictureUrl: editFormData.profilePictureUrl,
        };
        const response = await authServiceProfile.updateProfile(payload); 
        
        // Assuming API returns the updated user object or a success message
        // If it returns the updated user:
        if (response && response.data) {
            setProfileData(response.data);
            setAuthUser(response.data); 
        } else {
            // If API only returns success message, merge local changes and re-fetch or trust local
            const locallyUpdatedUser = { ...profileData, ...editFormData };
            setProfileData(locallyUpdatedUser);
            setAuthUser(locallyUpdatedUser);
        }
        alert(response.message || "Profile updated successfully!"); 
        setIsEditing(false);
    } catch (err) {
        setError(err.message || "Failed to update profile.");
    } finally {
        setLoading(false);
    }
  };
  
  if (authLoadingHook || loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;
  if (error) return <ErrorMessage message={error} onClose={() => setError(null)} />;
  if (!profileData && !token) return <p className="text-center text-gray-600 py-10">Please log in to view your profile.</p>;
  if (!profileData && token) return <p className="text-center text-gray-600 py-10">Could not load profile data. Please try refreshing.</p>;


  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h2>
        {!isEditing && profileData && ( // Ensure profileData exists before showing edit button
             <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md border border-blue-600 hover:bg-blue-50"
            >
                <Edit3 size={18} className="mr-1" /> Edit
            </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
                <label htmlFor="name-edit" className="block text-sm font-medium text-gray-700">Name</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" name="name" id="name-edit" value={editFormData.name} onChange={handleEditChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="email-edit-profile" className="block text-sm font-medium text-gray-700">Email</label>
                 <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIconProfile className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" name="email" id="email-edit-profile" value={editFormData.email} onChange={handleEditChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" readOnly/>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed through this form.</p>
                </div>
            </div>
            <div>
                <label htmlFor="phoneNumber-edit" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIconProfile className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" name="phoneNumber" id="phoneNumber-edit" value={editFormData.phoneNumber} onChange={handleEditChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="profilePictureUrl-edit" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                <div className="relative mt-1">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIconProfile className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="url" name="profilePictureUrl" id="profilePictureUrl-edit" value={editFormData.profilePictureUrl} onChange={handleEditChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {loading ? <Loader size="sm" /> : 'Save Changes'}
                </button>
            </div>
        </form>
      ) : profileData ? ( // Ensure profileData exists before rendering display
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
            <img 
                src={profileData.profilePictureUrl || `https://placehold.co/150x150/EBF4FF/76A9FA?text=${profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}`} 
                alt="Profile" 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-md border-2 border-gray-200"
                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/150x150/EBF4FF/76A9FA?text=${profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}`; }}
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">{profileData.name || 'User Name'}</h3>
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-start">
                    <MailIconProfile className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                        <p className="mt-0.5 text-md text-gray-900 break-all">{profileData.email}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <PhoneIconProfile className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                     <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                        <p className="mt-0.5 text-md text-gray-900">{profileData.phoneNumber || 'Not Provided'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <UserCircleIcon className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Role</h4>
                        <p className="mt-0.5 text-md text-gray-900 capitalize">{profileData.role || 'User'}</p>
                    </div>
                </div>
            </div>
        </div>
      ) : null } {/* Render nothing if profileData is null and not editing */}
    </div>
  );
};

ProfilePage.defaultProps = {
  user: null, // Default to null if no user is provided
};

export default ProfilePage;