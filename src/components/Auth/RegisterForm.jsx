import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Eye, EyeOff , Mail as MailIcon, Lock as LockIcon, Phone, Image as ImageIcon } from 'lucide-react'; // Renamed icons to avoid conflict

import ErrorMessage from '../UI/ErrorMessage';
import Loader from '../UI/Loader';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '', // check API
    email: '', // check API
    password: '',
    passwordRepeat: '',
    role: 'user', // Default role
    profilePictureUrl: '', // Optional
    phoneNumber: '', // Optional
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match.");
      return;
    }

    // email, password, passwordRepeat, role, profilePictureUrl, phoneNumber
    const apiPayload = {
        email: formData.email,
        password: formData.password,
        passwordRepeat: formData.passwordRepeat,
        role: formData.role, // or a default
        profilePictureUrl: formData.profilePictureUrl || 'https://placehold.co/400x400/EBF4FF/76A9FA?text=User', // Default placeholder
        phoneNumber: formData.phoneNumber || '0000000000', // Default or optional
    };

    const success = await register(apiPayload);
    if (success) {
      // AuthContext handles navigation to login
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="email" name="email" id="email-register" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type={showPassword ? "text" : "password"} name="password" id="password-register" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Password Repeat */}
        <div>
          <label htmlFor="passwordRepeat" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type={showPasswordRepeat ? "text" : "password"} name="passwordRepeat" id="passwordRepeat" required value={formData.passwordRepeat} onChange={handleChange} placeholder="••••••••" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <button type="button" onClick={() => setShowPasswordRepeat(!showPasswordRepeat)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
              {showPasswordRepeat ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="user">User</option>
            <option value="admin">Admin</option> {/* Check auth */}
          </select>
        </div>

        {/* Optional */}
        <div>
          <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL (Optional)</label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="url" name="profilePictureUrl" id="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleChange} placeholder="https://example.com/image.png" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="08123456789" className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>


        <div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
            {loading ? <Loader size="sm" /> : 'Register'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;