import { XCircle, AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;
  // Check if message is an object (likely an Axios error object)
  let displayMessage = message;
  if (typeof message === 'object' && message !== null) {
    if (message.message) { // Standard error object
        displayMessage = message.message;
    } else if (message.error && typeof message.error === 'string') { // Custom error structure
        displayMessage = message.error;
    } else { // Fallback for other object structures
        displayMessage = JSON.stringify(message);
    }
  }


  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-sm" role="alert">
      <div className="flex items-center">
        <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
        <div className="flex-grow">
          <p className="font-semibold">Error</p>
          <p className="text-sm break-words">{displayMessage}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8" aria-label="Dismiss">
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.defaultProps = {
  onClose: null, // Default to no close handler
};

export default ErrorMessage;