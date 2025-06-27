// src/hooks/useImageUpload.js
import { useState, useCallback } from 'react';
import { uploadImage } from '../api/uploadService'; // Assuming uploadImage is a named export
import { MAX_IMAGE_UPLOAD_SIZE_MB, ALLOWED_IMAGE_TYPES } from '../utils/constants'; // Constants for validation

/**
 * Custom hook for managing image upload logic.
 *
 * @param {object} [options={}] - Configuration options for the hook.
 * @param {number} [options.maxSizeMB=MAX_IMAGE_UPLOAD_SIZE_MB] - Maximum allowed file size in MB.
 * @param {string[]} [options.allowedTypes=ALLOWED_IMAGE_TYPES] - Allowed MIME types.
 * @returns {object} An object containing upload state and functions.
 * @returns {string | null} return.imageUrl - The URL of the successfully uploaded image.
 * @returns {boolean} return.isUploading - True if an upload is in progress.
 * @returns {number} return.progress - Upload progress from 0 to 100.
 * @returns {string | null} return.error - Any error message during upload.
 * @returns {function} return.uploadFile - Function to initiate file upload (takes File object).
 * @returns {function} return.resetUpload - Function to reset the upload state.
 */
function useImageUpload(options = {}) {
  const {
    maxSizeMB = MAX_IMAGE_UPLOAD_SIZE_MB,
    allowedTypes = ALLOWED_IMAGE_TYPES,
  } = options;

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const resetUpload = useCallback(() => {
    setImageUrl(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const validateFile = useCallback((file) => {
    if (!file) {
      return 'No file selected.';
    }
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}.`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit.`;
    }
    return null;
  }, [maxSizeMB, allowedTypes]);

  const uploadFile = useCallback(async (file) => {
    resetUpload(); // Reset state at the start of a new upload

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setProgress(0); // Start progress at 0

    const formData = new FormData();
    formData.append('image', file); // 'image' key must match your backend

    try {
      // Simulate progress for the hook's internal state.
      // For real progress from Axios, you'd integrate onUploadProgress callback.
      // Example:
      // const response = await uploadService.uploadImage(formData, {
      //   onUploadProgress: (event) => {
      //     setProgress(Math.round((100 * event.loaded) / event.total));
      //   },
      // });
      
      // Using direct uploadImage call for simplicity, assuming it handles its own internal progress/resolution
      const response = await uploadImage(formData);
      
      if (response && response.imageUrl) {
        setImageUrl(response.imageUrl);
        setProgress(100); // Ensure 100% on success
      } else {
        throw new Error('Upload failed: No image URL received from server.');
      }
    } catch (err) {
      console.error('Image upload hook error:', err);
      setError(err.response?.data?.message || err.message || 'Image upload failed.');
      setImageUrl(null); // Clear URL on error
      setProgress(0); // Reset progress on error
    } finally {
      setIsUploading(false);
    }
  }, [resetUpload, validateFile]);

  return { imageUrl, isUploading, progress, error, uploadFile, resetUpload };
}

export default useImageUpload;