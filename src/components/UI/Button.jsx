// src/components/UI/Button.jsx
import React from 'react';
import PropTypes from 'prop-types'; // For JSDoc-like prop validation (though not strictly JSDoc itself)

/**
 * Reusable Button Component.
 * Uses Tailwind CSS for styling and supports different variants, sizes, and states.
 *
 * @param {object} props - The component props.
 * @param {'primary' | 'secondary' | 'danger' | 'success' | 'warning'} [props.variant='primary'] - The visual style of the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the button.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled.
 * @param {function} props.onClick - The click handler for the button.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to apply.
 * @param {string} [props.type='button'] - The type attribute of the button element.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const baseStyles = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#0B7582] text-white hover:bg-[#095e68] focus:ring-[#0B7582]',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-[#EF7B24] text-white hover:bg-[#d96c1e] focus:ring-[#EF7B24]',
    success: 'bg-[#EF7B24] text-white hover:bg-[#d96c1e] focus:ring-[#EF7B24]',
    warning: 'bg-[#EF7B24] text-white hover:bg-[#d96c1e] focus:ring-[#EF7B24]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled ? disabledStyles : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;