import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, CreditCard } from 'lucide-react';

const TransactionStatus = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={14} className="sm:w-4 sm:h-4" />
        };
      case 'paid':
        return {
          label: 'Paid',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CreditCard size={14} className="sm:w-4 sm:h-4" />
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={14} className="sm:w-4 sm:h-4" />
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={14} className="sm:w-4 sm:h-4" />
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle size={14} className="sm:w-4 sm:h-4" />
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle size={14} className="sm:w-4 sm:h-4" />
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle size={14} className="sm:w-4 sm:h-4" />
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
      {statusConfig.icon}
      <span className="ml-1">{statusConfig.label}</span>
    </span>
  );
};

export default TransactionStatus;
