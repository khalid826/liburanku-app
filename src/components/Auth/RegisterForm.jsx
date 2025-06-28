import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Eye, EyeOff, Mail as MailIcon, Lock as LockIcon, Phone, Image as ImageIcon, UserPlus } from 'lucide-react';
import ErrorMessage from '../UI/ErrorMessage';
import Loader from '../UI/Loader';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    role: 'user',
    profilePictureUrl: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const { register, loading, error, setError } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  // Check if required fields are complete
  const isFormComplete = formData.name.trim() && 
                        formData.email.trim() && 
                        formData.password.trim() && 
                        formData.passwordRepeat.trim() && 
                        formData.password === formData.passwordRepeat &&
                        formData.password.length >= 6;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required.");
      showError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      showError("Email is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      showError("Password is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      showError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match.");
      showError("Passwords do not match.");
      return;
    }

    // Prepare API payload based on Postman collection
    const apiPayload = {
      email: formData.email,
      password: formData.password,
      passwordRepeat: formData.passwordRepeat,
      role: formData.role,
      profilePictureUrl: formData.profilePictureUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
      phoneNumber: formData.phoneNumber || '08976041232',
    };

    const result = await register(apiPayload);
    if (result.success) {
      showSuccess("Registration successful! Please log in.");
      onSuccess && onSuccess();
    } else {
      showError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B7582] via-[#095e68] to-[#0B7582] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80 text-sm">Join us and start your travel journey</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email-register" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email-register"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password-register" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password-register"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Repeat Field */}
            <div>
              <label htmlFor="passwordRepeat" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasswordRepeat ? "text" : "password"}
                  name="passwordRepeat"
                  id="passwordRepeat"
                  required
                  value={formData.passwordRepeat}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswordRepeat ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
              >
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Profile Picture URL Field */}
            <div>
              <label htmlFor="profilePictureUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Picture URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="profilePictureUrl"
                  id="profilePictureUrl"
                  value={formData.profilePictureUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !isFormComplete}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-[#0B7582] hover:bg-[#095e68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B7582] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader size="sm" />
                    <span className="ml-2">Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus size={18} className="mr-2" />
                    Create Account
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#0B7582] hover:text-[#095e68] transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-[#0B7582] transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;