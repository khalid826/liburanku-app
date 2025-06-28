// src/pages/User/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { paymentService, transactionService } from '../../api'; // Assuming these are named exports or an object
import PromoCodeInput from '../../components/Promo/PromoCodeInput';
import PaymentMethodsDisplay from '../../components/Checkout/PaymentMethodsDisplay';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import PriceDisplay from '../../components/Common/PriceDisplay'; // Fixed import path
import Button from '../../components/UI/Button'; // Import Button component
import { CreditCard, ShoppingBag, ArrowLeft, CheckCircle, Tag, ShoppingCart } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CheckoutForm from '../../components/Checkout/CheckoutForm';
import CartSummary from '../../components/Checkout/CartSummary';
import PaymentMethods from '../../components/Checkout/PaymentMethods';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedItems,
    loading: cartLoading,
    error: cartError,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    calculateSubtotal,
    calculateTotal,
    clearCart
  } = useCart();
  const { user } = useAuth(); // Assuming user is not directly used for display in this snippet
  const { showSuccess, showError, showNotification } = useNotification();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [formData, setFormData] = useState({
    specialRequests: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const totalAmount = calculateTotal();

  // Get selected cart items for checkout
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

  const handlePromoApplied = (promoData) => {
    applyPromoCode(promoData);
  };

  const handlePromoRemoved = () => {
    removePromoCode();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    if (!selectedPaymentMethod) newErrors.paymentMethod = 'Please select a payment method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('Order placed successfully!', 'success');
      navigate('/transactions');
    } catch (err) {
      setError('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.agreeToTerms && selectedPaymentMethod;

  if (cartLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  if (cartError) {
    return <ErrorMessage message={cartError} />;
  }

  if (selectedCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <CreditCard size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Complete your booking and secure your travel experience
            </p>
          </div>

          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

          <div className="text-center py-8 sm:py-12">
            <ShoppingCart size={64} className="sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-3 sm:mb-4">
              {cartItems.length === 0 ? 'Your cart is empty' : 'No items selected for checkout'}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              {cartItems.length === 0 
                ? 'Add some activities to your cart before proceeding to checkout'
                : 'Please select items from your cart before proceeding to checkout'
              }
            </p>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0B7582] text-white font-semibold rounded-lg shadow-md hover:bg-[#095e68] transition-colors text-sm sm:text-base"
            >
              {cartItems.length === 0 ? 'Go to Cart' : 'Back to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success && transactionId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your transaction ID is: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{transactionId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            Please complete your payment and upload proof of payment in your transaction history.
          </p>
          <div className="space-y-3">
            {/* Using Button component */}
            <Button
              onClick={() => navigate(`/transaction/${transactionId}`)}
              variant="primary"
              size="md"
              className="w-full"
            >
              View Transaction Details
            </Button>
            {/* Using Button component */}
            <Button
              onClick={() => navigate('/transactions')}
              variant="secondary"
              size="md"
              className="w-full"
            >
              View All Transactions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success && !transactionId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your transaction has been created successfully!
          </p>
          <p className="text-gray-600 mb-8">
            Please complete your payment and upload proof of payment in your transaction history.
          </p>
          <div className="space-y-3">
            {/* Using Button component */}
            <Button
              onClick={() => navigate('/transactions')}
              variant="primary"
              size="md"
              className="w-full"
            >
              View All Transactions
            </Button>
            {/* Using Button component */}
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              size="md"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      {/* Checkout Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <CreditCard size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Complete your booking and secure your travel experience
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
            <PaymentMethods selectedMethod={selectedPaymentMethod} onSelectMethod={setSelectedPaymentMethod} />
            {/* Special Requests and T&C */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests || ''}
                  onChange={e => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>
              {/* Promo Code Input */}
              <div>
                <PromoCodeInput onPromoApplied={handlePromoApplied} onPromoRemoved={handlePromoRemoved} currentTotal={totalAmount} />
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms || false}
                  onChange={e => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-[#0B7582] focus:ring-[#0B7582] border-gray-300 rounded"
                  required
                />
                <label className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-[#0B7582] hover:text-[#095e68] underline">Terms and Conditions</a>{' '}
                  and{' '}
                  <a href="#" className="text-[#0B7582] hover:text-[#095e68] underline">Privacy Policy</a>
                  *
                </label>
              </div>
            </div>
          </div>
          {/* Right: Cart Summary, Promo Code, and Pay Button */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <CartSummary selectedItems={selectedItems} />
              <button
                onClick={handleCheckout}
                disabled={loading || !formData.agreeToTerms || !selectedPaymentMethod}
                className="w-full mt-6 px-6 py-3 bg-[#0B7582] text-white rounded-lg font-semibold hover:bg-[#095e68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size="sm" /> : `Pay Rp ${totalAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;