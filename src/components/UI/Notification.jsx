import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Info size={20} className="text-[#0B7582]" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-700`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-700`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-700`;
      default:
        return `${baseStyles} bg-[#e6f0fd] border-[#0B7582] text-[#0B7582]`;
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed z-50 ${getPosition()} ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
      <div className={getStyles()}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 mr-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification; 