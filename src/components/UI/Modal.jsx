// src/components/UI/Modal.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react'; // Assuming Lucide React icons are available

/**
 * Reusable Modal Component.
 * Displays content in a dialog box, with backdrop and close functionality.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - If true, the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {string} [props.title=''] - The title displayed at the top of the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal body.
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} [props.size='md'] - The size of the modal.
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button.
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether to close the modal on overlay click.
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title = '', 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
};

export default Modal;