// src/components/UI/Rating.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react'; // Assuming Lucide React icons are available

/**
 * Reusable Rating Component.
 * Displays a star rating and optionally allows user interaction to set a rating.
 *
 * @param {object} props - The component props.
 * @param {number} props.rating - The current rating value (e.g., 3.5).
 * @param {number} [props.maxRating=5] - The maximum possible rating (number of stars).
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The visual size of the stars.
 * @param {boolean} [props.readonly=true] - If true, the rating cannot be changed by user interaction.
 * @param {function} [props.onRatingChange] - Callback function (newRating) => void, called when user sets a rating (only if not readonly).
 */
const Rating = ({
  rating,
  maxRating = 5,
  size = 'md',
  readonly = true,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index);
    }
  };

  // This function now returns the actual hex color codes
  const getStarFillColor = (index) => {
    const displayRating = hoverRating || rating;
    if (index <= displayRating) {
      return '#EF7B24';
    }
    return '#d1d5db'; // Tailwind gray-300
  };

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        // Determine if the star should be considered "filled" for visual purposes
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <Star
            key={starValue}
            className={`
              ${starSizeClasses[size]}
              ${!readonly ? 'cursor-pointer' : ''}
              transition-colors duration-200
            `}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onClick={() => handleClick(starValue)}
            fill={getStarFillColor(starValue)}
            color={getStarFillColor(starValue)}
            strokeWidth={1.5}
          />
        );
      })}
      {/* Only show decimal rating if it's not an integer and greater than 0 */}
      {rating > 0 && !Number.isInteger(rating) && (
        <span className={`ml-2 text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  readonly: PropTypes.bool,
  onRatingChange: PropTypes.func,
};

export default Rating;