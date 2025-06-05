import { Link as RouterLinkActivityCard } from 'react-router-dom'; // Aliased
import { Star as StarIconCard, MapPin as MapPinIconCard } from 'lucide-react'; // Aliased

const ActivityCard = ({ activity }) => {
  if (!activity) return null;

  const displayPrice = activity.price_discount && activity.price_discount < activity.price ? activity.price_discount : activity.price;
  const originalPrice = activity.price_discount && activity.price_discount < activity.price ? activity.price : null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // const halfStar = rating % 1 !== 0; // Simplified to full stars for card
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIconCard key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(<StarIconCard key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />);
    }
    return stars;
  };

  return (
    <RouterLinkActivityCard to={`/activity/${activity.id}`} className="block group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <img 
          src={activity.imageUrls && activity.imageUrls.length > 0 ? activity.imageUrls[0] : 'https://placehold.co/600x400/EBF4FF/76A9FA?text=No+Image'} 
          alt={activity.title} 
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EBF4FF/76A9FA?text=No+Image'; }}
        />
        {/* Optional: Add a badge for discount or new item */}
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 truncate" title={activity.title}>
                {activity.title}
            </h3>
            {activity.city && activity.province && (
                <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <MapPinIconCard size={12} className="mr-1 flex-shrink-0" /> {activity.city}, {activity.province}
                </p>
            )}
            <div className="flex items-center mb-2">
                <div className="flex mr-1.5">{renderStars(activity.rating)}</div>
                <span className="text-xs text-gray-500">({activity.total_reviews} reviews)</span>
            </div>
        </div>
        <div className="mt-2">
            <span className="text-xl font-bold text-indigo-600">
                ${Number(displayPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {originalPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
                ${Number(originalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            )}
        </div>
      </div>
       <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details</span>
        </div>
    </RouterLinkActivityCard>
  );
};

ActivityCard.defaultProps = {
  activity: null, // Default to null if no activity is provided
};

export default ActivityCard;