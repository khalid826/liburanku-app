import { useState } from 'react';
import { promoService } from '../../api';
import { CheckCircle, XCircle, Tag, Loader } from 'lucide-react';

const PromoCodeInput = ({ onPromoApplied, onPromoRemoved, currentTotal = 0 }) => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Get all promos and validate locally since there's no direct validation endpoint
      const response = await promoService.getPromos();
      const promos = response.data || [];
      
      // Find the promo code
      const foundPromo = promos.find(promo => 
        promo.promo_code?.toLowerCase() === promoCode.toLowerCase() && 
        promo.is_active
      );

      if (!foundPromo) {
        setError('Invalid or inactive promo code');
        return;
      }

      // Check if promo is expired
      const now = new Date();
      const startDate = new Date(foundPromo.start_date);
      const endDate = new Date(foundPromo.end_date);

      if (now < startDate) {
        setError('Promo code is not yet active');
        return;
      }

      if (now > endDate) {
        setError('Promo code has expired');
        return;
      }

      // Check minimum purchase requirement
      if (foundPromo.minimum_claim_price && currentTotal < foundPromo.minimum_claim_price) {
        setError(`Minimum purchase of $${foundPromo.minimum_claim_price.toLocaleString()} required`);
        return;
      }

      // Promo is valid
      setAppliedPromo(foundPromo);
      setError(null);
      
      // Calculate discount
      const discountAmount = foundPromo.promo_discount_price || 0;
      const finalTotal = Math.max(0, currentTotal - discountAmount);
      
      onPromoApplied({
        promo: foundPromo,
        discountAmount,
        finalTotal
      });

    } catch (err) {
      setError('Failed to validate promo code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setError(null);
    onPromoRemoved();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidating) {
      validatePromoCode();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Tag size={20} className="mr-2 text-green-600" />
        Promo Code
      </h3>

      {appliedPromo ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle size={20} className="text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">
                  {appliedPromo.promo_code} - {appliedPromo.title}
                </p>
                <p className="text-sm text-green-600">
                  Discount: ${appliedPromo.promo_discount_price?.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={removePromo}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isValidating}
            />
            <button
              type="submit"
              disabled={isValidating || !promoCode.trim()}
              className="px-4 py-2 bg-[#0B7582] text-white rounded-md hover:bg-[#095e68] focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isValidating ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <XCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PromoCodeInput;
