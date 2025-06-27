// src/components/UI/ImageUploader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../../api/uploadService';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

/**
 * ImageUploader Component
 * Provides a UI for selecting or dragging & dropping an image,
 * previews it, uploads it, and handles validation and progress.
 *
 * @param {object} props
 * @param {string} props.initialImageUrl - Optional initial image URL to display.
 * @param {function} props.onImageUploadSuccess - Callback function with the uploaded image URL.
 * @param {number} [props.maxFileSizeMB=5] - Maximum allowed file size in MB.
 * @param {string[]} [props.allowedFileTypes=['image/jpeg', 'image/png', 'image/webp']] - Allowed MIME types.
 */
const ImageUploader = ({
  initialImageUrl = '',
  onImageUploadSuccess,
  maxFileSizeMB = 5,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Simple progress 0-100
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Effect to update previewUrl when initialImageUrl prop changes
  useEffect(() => {
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

  const validateFile = (file) => {
    if (!file) return 'No file selected.';

    if (!allowedFileTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedFileTypes.map(t => t.split('/')[1]).join(', ')}.`;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxFileSizeMB}MB limit.`;
    }

    return null; // No error
  };

  const handleFileChange = (file) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      // If there was an initial image, revert preview to it on validation error
      setPreviewUrl(initialImageUrl);
      return;
    }

    setSelectedFile(file);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    // Clean up previous object URL if any, but only if it's not the initial one
    if (previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('border-indigo-500'); // Highlight drop zone
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-indigo-500'); // Remove highlight
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-indigo-500'); // Remove highlight

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate progress for demonstration.
      // For real progress, you would typically use Axios's onUploadProgress callback.
      // Example:
      // const response = await axios.post('/upload', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(percentCompleted);
      //   }
      // });
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 100);


      // Your Postman collection uses 'image' as the field name for file upload.
      const formData = new FormData();
      formData.append('image', selectedFile); // The key 'image' must match your backend expectation

      const response = await uploadImage(formData); // This should return { imageUrl: '...' }
      clearInterval(interval); // Clear simulation interval

      if (response && response.imageUrl) {
        setUploadProgress(100); // Ensure it's 100% on success
        onImageUploadSuccess(response.imageUrl);
        setPreviewUrl(response.imageUrl); // Update preview to uploaded URL (persistent URL)
        setSelectedFile(null); // Clear selected file after successful upload
      } else {
        throw new Error('Upload failed: No image URL received in response.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      // If the error response has a 'message' field, use it. Otherwise, use generic message.
      setError(err.response?.data?.message || err.message || 'Image upload failed.');
      setUploadProgress(0); // Reset progress on error
      // Do NOT reset previewUrl here if an initial image was present
      // The current preview (either original or temporary for selected file) remains
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URL on component unmount or when selectedFile changes
  useEffect(() => {
    return () => {
      // If previewUrl is a temporary object URL created from a selected file, revoke it.
      // Do not revoke initialImageUrl as it's a persistent URL.
      if (selectedFile && previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]); // Depend on selectedFile and previewUrl

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div
        ref={dropZoneRef}
        className="w-full p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl && (
          <div className="mb-4 flex justify-center">
            <img src={previewUrl} alt="Image Preview" className="max-w-full h-32 object-contain rounded-md border border-gray-200" />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
          accept={allowedFileTypes.join(',')}
        />
        <p className="text-gray-600">Drag & drop an image here, or click to select</p>
        <p className="text-xs text-gray-500 mt-1">({allowedFileTypes.map(t => t.split('/')[1]).join(', ')}, max {maxFileSizeMB}MB)</p>
      </div>

      {selectedFile && (
        <div className="mt-4 w-full">
          <p className="text-sm text-gray-700 mb-2">Selected: {selectedFile.name}</p>
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader size="sm" /> : 'Upload Image'}
          </button>
        </div>
      )}
      {/* Show Clear Preview button only if there's a preview AND it's not the original initial image URL */}
      {previewUrl && (previewUrl !== initialImageUrl || selectedFile) && (
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(initialImageUrl); // Revert to initial image if available
              setError(null);
              setUploadProgress(0);
            }}
            className="mt-2 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear Selected Image
          </button>
      )}
    </div>
  );
};

export default ImageUploader;