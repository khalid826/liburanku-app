import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();

  // Default breadcrumb based on current path
  const getDefaultBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', path: '/', icon: <Home size={16} className="sm:w-4 sm:h-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle special cases
      if (segment === 'admin') {
        label = 'Admin Dashboard';
      } else if (segment === 'activity') {
        label = 'Activity Details';
      } else if (segment === 'category') {
        label = 'Category Details';
      } else if (segment === 'search') {
        label = 'Search Results';
      } else if (segment === 'cart') {
        label = 'Shopping Cart';
      } else if (segment === 'checkout') {
        label = 'Checkout';
      } else if (segment === 'profile') {
        label = 'Profile';
      } else if (segment === 'transactions') {
        label = 'My Trips';
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : getDefaultBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base mb-4 sm:mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
          )}
          {item.isLast ? (
            <span className="text-gray-600 font-medium flex items-center max-w-[150px] sm:max-w-[200px]">
              {item.icon && <span className="mr-1 sm:mr-2 flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-[#0B7582] transition-colors flex items-center max-w-[150px] sm:max-w-[200px]"
            >
              {item.icon && <span className="mr-1 sm:mr-2 flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 