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
    let previousSegment = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle special cases with proper routing
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
        // Checkout should come after cart
        if (previousSegment === 'cart') {
          label = 'Checkout';
        } else {
          label = 'Checkout';
        }
      } else if (segment === 'profile') {
        label = 'Profile';
      } else if (segment === 'transactions') {
        // Transaction list should come after profile, not home
        if (previousSegment === 'profile') {
          label = 'My Trips';
        } else {
          label = 'My Trips';
        }
      } else if (segment === 'transaction' && pathSegments[index + 1]) {
        // Transaction detail page
        label = 'Transaction Details';
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
      
      previousSegment = segment;
    });

    // Fix specific routing cases
    const breadcrumbItems = [...breadcrumbs];
    
    // If we're on checkout page, ensure cart comes before it
    if (location.pathname.includes('/checkout')) {
      const cartIndex = breadcrumbItems.findIndex(item => item.label === 'Checkout');
      if (cartIndex > 0 && breadcrumbItems[cartIndex - 1].label !== 'Shopping Cart') {
        breadcrumbItems.splice(cartIndex, 0, {
          label: 'Shopping Cart',
          path: '/cart',
          isLast: false
        });
        // Update the checkout item to not be last
        breadcrumbItems[cartIndex + 1].isLast = false;
        breadcrumbItems[breadcrumbItems.length - 1].isLast = true;
      }
    }
    
    // If we're on transaction detail page, ensure proper path
    if (location.pathname.includes('/transaction/') && !location.pathname.includes('/admin/')) {
      const transactionIndex = breadcrumbItems.findIndex(item => item.label === 'Transaction Details');
      if (transactionIndex > 0) {
        // Insert profile and transactions before transaction detail
        const insertItems = [
          {
            label: 'Profile',
            path: '/profile',
            isLast: false
          },
          {
            label: 'My Trips',
            path: '/transactions',
            isLast: false
          }
        ];
        
        // Remove any existing profile or transactions items
        const filteredItems = breadcrumbItems.filter(item => 
          item.label !== 'Profile' && item.label !== 'My Trips'
        );
        
        // Insert the proper path
        filteredItems.splice(1, 0, ...insertItems);
        
        // Update the transaction detail to be last
        const detailIndex = filteredItems.findIndex(item => item.label === 'Transaction Details');
        if (detailIndex > 0) {
          filteredItems[detailIndex].isLast = false;
          filteredItems[filteredItems.length - 1].isLast = true;
        }
        
        return filteredItems;
      }
    }
    
    // If we're on transaction list page, ensure profile comes before it
    if (location.pathname === '/transactions') {
      const transactionsIndex = breadcrumbItems.findIndex(item => item.label === 'My Trips');
      if (transactionsIndex > 0 && breadcrumbItems[transactionsIndex - 1].label !== 'Profile') {
        breadcrumbItems.splice(transactionsIndex, 0, {
          label: 'Profile',
          path: '/profile',
          isLast: false
        });
        // Update the transactions item to be last
        breadcrumbItems[transactionsIndex + 1].isLast = false;
        breadcrumbItems[breadcrumbItems.length - 1].isLast = true;
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = items.length > 0 ? items : getDefaultBreadcrumbs();

  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base mb-4 sm:mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
          )}
          {item.isLast ? (
            <span className="text-gray-600 font-medium flex items-center min-w-0 flex-shrink">
              {item.icon && <span className="mr-1 sm:mr-2 flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-[#0B7582] transition-colors flex items-center min-w-0 flex-shrink"
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