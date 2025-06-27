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
 */
const PriceDisplay = ({ amount, currency = DEFAULT_CURRENCY, showCents = null, size = 'md' }) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);

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
    '2xl': 'text-2xl font-bold', // Added a slightly bolder style for larger sizes
  };

  return (
    <span className={`font-semibold ${sizeClasses[size]} text-gray-900`}>
      {formatter.format(numericAmount)}
    </span>
  );
};

PriceDisplay.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currency: PropTypes.string,
  showCents: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
};

export default PriceDisplay;