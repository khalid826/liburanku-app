// src/components/Activity/ActivityCard.jsx
import React from 'react';
import { Link as RouterLinkActivityCard } from 'react-router-dom';
import { MapPin as MapPinIconCard, Star as StarIconCard } from 'lucide-react';

// Import the new components
import PriceDisplay from '../Common/PriceDisplay'; // Fixed import path
import Rating from '../Common/Rating'; // Fixed import path
import { DEFAULT_CURRENCY } from '../../utils/constants';
import { calculateActivityPrices } from '../../utils/helpers';

const ActivityCard = ({ activity }) => {
  if (!activity) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const { displayPrice, originalPrice } = calculateActivityPrices(activity);

  return (
    <RouterLinkActivityCard 
      to={`/activity/${activity.id}`} 
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={activity.imageUrls && activity.imageUrls.length > 0 
            ? activity.imageUrls[0] 
            : 'https://placehold.co/400x300/EBF4FF/76A9FA?text=No+Image'
          }
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x300/EBF4FF/76A9FA?text=No+Image';
          }}
        />
        {originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {((originalPrice - displayPrice) / originalPrice * 100).toFixed(0)}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-[#0B7582] transition-colors mb-1 truncate" title={activity.title}>
                {activity.title}
            </h3>
            {activity.city && activity.province && (
                <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <MapPinIconCard size={12} className="mr-1 flex-shrink-0" /> {activity.city}, {activity.province}
                </p>
            )}
            <div className="flex items-center mb-2">
                <Rating rating={activity.rating} size="sm" readonly={true} />
                <span className="text-xs text-gray-600 ml-1">({activity.total_reviews} reviews)</span>
            </div>
        </div>
        <div className="mt-2">
            {/* Use enhanced PriceDisplay component */}
            <PriceDisplay
              amount={displayPrice}
              originalAmount={originalPrice}
              currency={DEFAULT_CURRENCY}
              size="lg"
              showCents={true}
              showDiscount={true}
            />
        </div>
      </div>
       <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-100 text-center">
            <span className="text-xs sm:text-sm font-medium text-[#0B7582] group-hover:underline">View Details</span>
        </div>
    </RouterLinkActivityCard>
  );
};

ActivityCard.defaultProps = {
  activity: null, // Default to null if no activity is provided
};

export default ActivityCard;