import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, MapPin, ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Category Image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-[#0B7582] to-[#EF7B24] overflow-hidden">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={36} className="sm:w-12 sm:h-12 text-white/80" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
      </div>

      {/* Category Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-2">
            <Tag size={16} className="sm:w-5 sm:h-5 text-[#0B7582]" />
            <h3 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-[#0B7582] transition-colors">
              {category.name}
            </h3>
          </div>
          <ArrowRight 
            size={16} 
            className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#0B7582] group-hover:translate-x-1 transition-all duration-300" 
          />
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
          {category.description || 'No description available'}
        </p>

        {/* Category Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={12} className="sm:w-4 sm:h-4" />
            <span>{category.activities_count || 0} activities</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
