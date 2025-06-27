import React from 'react';

const banks = [
  {
    id: 'bca',
    name: 'BCA',
    description: 'Bank Central Asia',
    logo: '/partners/logo-bca.png',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'bri',
    name: 'BRI',
    description: 'Bank Rakyat Indonesia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Bank_Rakyat_Indonesia_logo.svg',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'mandiri',
    name: 'Mandiri',
    description: 'Bank Mandiri',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bank_Mandiri_logo.svg',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'bni',
    name: 'BNI',
    description: 'Bank Negara Indonesia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Logo_Bank_BNI.png',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'cimb',
    name: 'CIMB Niaga',
    description: 'CIMB Niaga',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo_CIMB_Niaga.svg',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
];

const PaymentMethods = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <div
            key={bank.id}
            onClick={() => onSelectMethod(bank.id)}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
              selectedMethod === bank.id
                ? `${bank.borderColor} ${bank.bgColor} ring-2 ring-[#0B7582] ring-opacity-50`
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 text-sm sm:text-base ${bank.color}`}>{bank.name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">{bank.description}</p>
            </div>
            {selectedMethod === bank.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-[#0B7582] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedMethod && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm text-green-700">
            You will receive payment instructions for the selected bank after checkout.
          </span>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
