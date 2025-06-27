// src/utils/constants.js

/**
 * Application-wide constants.
 * Use these for API endpoints, status codes, roles, default values, etc.
 */

// API Endpoints - It's common to define base paths, but specific paths are usually in service files
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'; // Fallback for local dev
export const API_KEY = import.meta.env.VITE_API_KEY;

// Currency Configuration
export const DEFAULT_CURRENCY = 'IDR';
export const CURRENCY_CONFIG = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    locale: 'id-ID',
    showCents: false, // IDR typically doesn't show cents
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    showCents: true,
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest', // If you have a guest role for unauthenticated users
};

// Admin Configuration
export const ADMIN_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_BULK_OPERATIONS: 50,
  EXPORT_FORMATS: ['csv', 'excel', 'pdf'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGE_SIZE_MB: 5,
};

// Transaction Statuses
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELED: 'canceled',
  // Add other statuses as needed, e.g., 'processing', 'refunded'
};

// Default Values / Limits
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_IMAGE_UPLOAD_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Regular Expressions (Examples)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Add more regexes for password strength, phone number, etc.

// Local Storage Keys
export const LOCAL_STORAGE_AUTH_TOKEN = 'authToken';
export const LOCAL_STORAGE_USER_PROFILE = 'userProfile'; // If you store basic user info

// Other UI or app-specific constants
export const APP_NAME = 'Travel App';
export const CONTACT_EMAIL = 'support@travelapp.com';
export const PHONE_NUMBER = '+1234567890';