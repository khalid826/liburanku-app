import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const CheckoutForm = ({ formData, setFormData, errors }) => {
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Initialize form data with user info if available
  React.useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: user.address || ''
      }));
    }
  }, [user, formData.name, setFormData]);

  return (
    <div className="space-y-6">
      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
          placeholder="Any special requests or dietary requirements..."
        />
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms || false}
          onChange={handleChange}
          className="mt-1 h-4 w-4 text-[#0B7582] focus:ring-[#0B7582] border-gray-300 rounded"
          required
        />
        <label className="text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-[#0B7582] hover:text-[#095e68] underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#0B7582] hover:text-[#095e68] underline">
            Privacy Policy
          </a>
          *
        </label>
      </div>
    </div>
  );
};

export default CheckoutForm;
