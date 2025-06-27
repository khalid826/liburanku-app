// src/components/Checkout/PaymentMethodsDisplay.jsx
import React, { useState, useEffect } from 'react';
import { getPaymentMethods } from '../../api/paymentService'; // Fixed import
import Loader from '../UI/Loader'; // Assuming Loader component path
import ErrorMessage from '../UI/ErrorMessage'; // Assuming ErrorMessage component path

/**
 * PaymentMethodsDisplay Component
 * Displays available payment methods and allows selection.
 *
 * @param {object} props
 * @param {string} props.selectedPaymentMethodId - The currently selected payment method ID.
 * @param {function} props.onSelectMethod - Callback function to update the selected payment method ID in the parent component.
 */
const PaymentMethodsDisplay = ({ selectedPaymentMethodId, onSelectMethod }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      setError(null);
      try {
        // As per Postman collection, GET /api/v1/payment-methods requires apiKey
        // Assuming apiClient in paymentService handles apiKey from environment
        const response = await getPaymentMethods();
        // Assuming the response structure is { data: [...] } where data is an array of methods
        setPaymentMethods(response.data || []);
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
        setError(err.response?.data?.message || 'Failed to load payment methods. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader />
        <p className="ml-2 text-gray-600">Loading payment methods...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onClose={() => setError(null)} />;
  }

  if (paymentMethods.length === 0) {
    return <p className="text-gray-500 text-center py-8">No payment methods available at this time.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Select a Payment Method</h3>
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          htmlFor={`payment-method-${method.id}`}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
            ${selectedPaymentMethodId === method.id ? 'border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input
            type="radio"
            id={`payment-method-${method.id}`}
            name="paymentMethod"
            value={method.id}
            checked={selectedPaymentMethodId === method.id}
            onChange={() => onSelectMethod(method.id)}
            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
          />
          <div className="ml-4 flex-1">
            <p className="text-base font-medium text-gray-900">{method.name}</p>
            {method.description && (
              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
            )}
            {/* You might add method.imageUrl here if available from API */}
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodsDisplay;