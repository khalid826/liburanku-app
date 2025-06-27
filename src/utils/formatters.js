// src/utils/formatters.js
import { DEFAULT_CURRENCY, CURRENCY_CONFIG } from './constants';

/**
 * Utility functions for formatting various types of data.
 */

/**
 * Formats a date string or Date object into a readable format.
 * @param {string | Date} dateInput - The date string or Date object to format.
 * @param {object} [options] - Options for Intl.DateTimeFormat.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateInput, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Formats a number as a currency string.
 * This is similar to what PriceDisplay does, but as a standalone utility.
 * @param {number} amount - The numerical amount.
 * @param {string} [currency='IDR'] - The currency code (e.g., 'IDR', 'USD', 'EUR').
 * @param {boolean} [showCents] - If true, displays decimal cents. Defaults to currency config.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY, showCents = null) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '';
  
  const currencyConfig = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG[DEFAULT_CURRENCY];
  const shouldShowCents = showCents !== null ? showCents : currencyConfig.showCents;
  
  const formatter = new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: shouldShowCents ? 2 : 0,
    maximumFractionDigits: shouldShowCents ? 2 : 0,
  });
  return formatter.format(amount);
};

/**
 * Formats a phone number string. (Basic example, can be extended for international formats)
 * @param {string} phoneNumber - The phone number string.
 * @returns {string} The formatted phone number string.
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-digits
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Matches (XXX) XXX-XXXX
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber; // Return original if no match
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length and adds ellipsis if it's longer.
 * @param {string} str - The input string.
 * @param {number} maxLength - The maximum length before truncation.
 * @returns {string} The truncated string.
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};