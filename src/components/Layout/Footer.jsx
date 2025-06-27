import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Users, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/', label: 'YouTube' }
  ];

  const paymentMethods = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'BCA', logo: '🏦' },
    { name: 'Mandiri', logo: '🏦' },
    { name: 'GoPay', logo: '📱' },
    { name: 'OVO', logo: '📱' }
  ];

  // Scroll to top and navigate
  const handleQuickLink = (to) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <img 
                src="/liburanku.png" 
                alt="Liburanku Logo" 
                className="h-6 sm:h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Your trusted travel companion for exploring the beautiful destinations across Indonesia. 
              Discover amazing experiences and create unforgettable memories.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label={social.label}
                  target="_blank" rel="noopener noreferrer"
                >
                  <social.icon size={18} className="sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><button onClick={() => handleQuickLink('/')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Home</button></li>
              <li><button onClick={() => handleQuickLink('/activities')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Activities</button></li>
              <li><button onClick={() => handleQuickLink('/categories')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Categories</button></li>
              <li><button onClick={() => handleQuickLink('/about')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">About Us</button></li>
              <li><button onClick={() => handleQuickLink('/contact')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Contact</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><button onClick={() => handleQuickLink('/help')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Help Center</button></li>
              <li><button onClick={() => handleQuickLink('/faq')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">FAQ</button></li>
              <li><button onClick={() => handleQuickLink('/terms')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Terms & Conditions</button></li>
              <li><button onClick={() => handleQuickLink('/privacy')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Privacy Policy</button></li>
              <li><button onClick={() => handleQuickLink('/refund')} className="text-gray-300 hover:text-white transition-colors w-full text-left text-sm sm:text-base py-1">Refund Policy</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start text-gray-300">
                <MapPin size={14} className="mr-2 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">Jl. Sudirman No. 123, Jakarta Pusat, Indonesia</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone size={14} className="mr-2 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail size={14} className="mr-2 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">info@liburanku.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Payment Methods</h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="flex items-center bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                    <span className="mr-1 sm:mr-2 text-sm">{method.logo}</span>
                    <span className="text-xs sm:text-sm">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center text-gray-300">
                  <Shield size={14} className="mr-2 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users size={14} className="mr-2 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-gray-400 text-xs sm:text-sm">
              <p>&copy; {currentYear} Liburanku. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ in Indonesia</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="flex flex-wrap space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                <button onClick={() => handleQuickLink('/terms')} className="hover:text-white transition-colors">Terms</button>
                <button onClick={() => handleQuickLink('/privacy')} className="hover:text-white transition-colors">Privacy</button>
                <button onClick={() => handleQuickLink('/cookies')} className="hover:text-white transition-colors">Cookies</button>
                <button onClick={() => handleQuickLink('/sitemap')} className="hover:text-white transition-colors">Sitemap</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;