// src/components/UI/PriceDisplay.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_CURRENCY, CURRENCY_CONFIG } from '../../utils/constants';

/**
 * Reusable PriceDisplay Component.
 * Formats and displays numerical amounts as currency.
 *
 * @param {object} props - The component props.
 * @param {number} props.amount - The numerical amount to display.
 * @param {string} [props.currency='IDR'] - The currency code (e.g., 'IDR', 'USD', 'EUR').
 * @param {boolean} [props.showCents] - If true, displays decimal cents. Defaults to currency config.
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} [props.size='md'] - The visual size of the price text.
 * @param {number} [props.originalAmount] - The original amount before discount (for strikethrough display).
 * @param {boolean} [props.showDiscount] - Whether to show discount percentage when originalAmount is provided.
 * @param {string} [props.className] - Additional CSS classes.
 */
const PriceDisplay = ({ 
  amount, 
  currency = DEFAULT_CURRENCY, 
  showCents = null, 
  size = 'md',
  originalAmount = null,
  showDiscount = false,
  className = ''
}) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  const numericOriginalAmount = originalAmount ? (typeof originalAmount === 'number' ? originalAmount : parseFloat(originalAmount)) : null;

  if (isNaN(numericAmount)) {
    return <span className="text-red-500">Invalid Price</span>;
  }

  const currencyConfig = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG[DEFAULT_CURRENCY];
  const shouldShowCents = showCents !== null ? showCents : currencyConfig.showCents;

  const formatter = new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: shouldShowCents ? 2 : 0,
    maximumFractionDigits: shouldShowCents ? 2 : 0,
  });

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl font-bold',
  };

  const hasDiscount = numericOriginalAmount && numericOriginalAmount > numericAmount;

  return (
    <div className={`${className}`}>
      {/* Main price */}
      <span className={`font-semibold ${sizeClasses[size]} text-gray-900`}>
        {formatter.format(numericAmount)}
      </span>
      
      {/* Original price with strikethrough */}
      {hasDiscount && (
        <span className={`ml-2 ${sizeClasses[size]} text-gray-400 line-through`}>
          {formatter.format(numericOriginalAmount)}
        </span>
      )}
      
      {/* Discount percentage */}
      {hasDiscount && showDiscount && (
        <span className="ml-2 text-xs text-green-600 font-medium">
          -{((numericOriginalAmount - numericAmount) / numericOriginalAmount * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};

PriceDisplay.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currency: PropTypes.string,
  showCents: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  originalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showDiscount: PropTypes.bool,
  className: PropTypes.string,
};

export default PriceDisplay;