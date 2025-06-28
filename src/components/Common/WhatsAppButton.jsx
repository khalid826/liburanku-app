import React, { useState } from 'react';
import { MessageCircle, X, Phone, HelpCircle } from 'lucide-react';

const randomNumbers = [
  '6281234567890',
  '6289876543210',
  '6281122334455',
  '6285566778899',
];

const getRandomNumber = () => {
  const idx = Math.floor(Math.random() * randomNumbers.length);
  return randomNumbers[idx];
};

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleWhatsAppClick = () => {
    const phoneNumber = getRandomNumber();
    const message = encodeURIComponent('Hi! I need help with Liburanku.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    const phoneNumber = '6281234567890'; // Indonesian dummy phone number
    window.open(`tel:${phoneNumber}`, '_self');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Mini Popup Window */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HelpCircle className="text-green-500" size={20} />
              <span className="font-semibold text-gray-800">Need Help?</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-700 mb-4 text-sm">
            Our support team is ready to help you via WhatsApp chat. Click the button below to start a conversation!
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <MessageCircle size={18} className="mr-2" /> Chat via WhatsApp
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        title="Need help?"
      >
        <MessageCircle size={20} className="sm:w-7 sm:h-7" />
      </button>
    </div>
  );
};

export default WhatsAppButton; 