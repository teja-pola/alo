import React from 'react';
import PropTypes from 'prop-types';

const Input = React.forwardRef(({
  type = 'text',
  label,
  error,
  className = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`
            block w-full rounded-md shadow-sm
            ${disabled ? 'bg-gray-100' : 'bg-white'}
            ${error ? 'border-red-300' : 'border-gray-300'}
            focus:ring-primary-500 focus:border-primary-500
            disabled:cursor-not-allowed disabled:opacity-75
            sm:text-sm
            ${className}
          `}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input; 