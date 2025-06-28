import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import ErrorMessage from '../UI/ErrorMessage';
import Loader from '../UI/Loader';
import { USER_ROLES } from '../../utils/constants';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, setError } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if form is complete
  const isFormComplete = email.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      showError("Email and password are required.");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      // Check if user is admin and redirect accordingly
      const user = result.user;
      if (user && user.role === USER_ROLES.ADMIN) {
        showSuccess("Welcome back, Admin!");
        navigate('/admin', { replace: true });
      } else {
        showSuccess("Login successful!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
      showError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B7582] via-[#095e68] to-[#0B7582] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email-login" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-login"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password-login" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password-login"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-[#0B7582] transition-all duration-200 text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-[#0B7582] hover:text-[#095e68] transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Create one here
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
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;