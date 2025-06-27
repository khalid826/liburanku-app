// src/utils/validators.js

/**
 * Utility functions for common form input validation.
 */

import { EMAIL_REGEX } from './constants'; // Assuming EMAIL_REGEX is defined in constants.js

/**
 * Validates an email address format.
 * @param {string} email - The email string to validate.
 * @returns {string | null} Error message if invalid, null if valid.
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required.';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email address format.';
  }
  return null;
};

/**
 * Validates a password based on specific criteria.
 * @param {string} password - The password string to validate.
 * @returns {string | null} Error message if invalid, null if valid.
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  // Add more complex validation rules as needed, e.g.:
  // if (!/[A-Z]/.test(password)) {
  //   return 'Password must contain at least one uppercase letter.';
  // }
  // if (!/[a-z]/.test(password)) {
  //   return 'Password must contain at least one lowercase letter.';
  // }
  // if (!/[0-9]/.test(password)) {
  //   return 'Password must contain at least one number.';
  // }
  // if (!/[!@#$%^&*()]/.test(password)) {
  //   return 'Password must contain at least one special character.';
  // }
  return null;
};

/**
 * Validates if two password fields match.
 * @param {string} password - The first password.
 * @param {string} passwordRepeat - The repeated password.
 * @returns {string | null} Error message if they don't match, null if they do.
 */
export const validatePasswordRepeat = (password, passwordRepeat) => {
  if (!passwordRepeat) {
    return 'Password confirmation is required.';
  }
  if (password !== passwordRepeat) {
    return 'Passwords do not match.';
  }
  return null;
};

/**
 * Validates if a field is not empty.
 * @param {string} value - The value to validate.
 * @param {string} fieldName - The name of the field (for error message).
 * @returns {string | null} Error message if empty, null if valid.
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required.`;
  }
  if (value === null || value === undefined) {
    return `${fieldName} is required.`;
  }
  return null;
};

/**
 * Validates if a number is positive.
 * @param {number | string} value - The number to validate.
 * @param {string} fieldName - The name of the field.
 * @returns {string | null} Error message if not positive, null if valid.
 */
export const validatePositiveNumber = (value, fieldName = 'Value') => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a number.`;
  }
  if (num < 0) {
    return `${fieldName} cannot be negative.`;
  }
  return null;
};

/**
 * Validates a URL format (basic check).
 * @param {string} url - The URL string to validate.
 * @returns {string | null} Error message if invalid, null if valid.
 */
export const validateUrl = (url) => {
  if (!url) {
    return 'URL is required.';
  }
  try {
    new URL(url); // Attempt to create a URL object
    return null;
  } catch (e) {
    return 'Invalid URL format.';
  }
};