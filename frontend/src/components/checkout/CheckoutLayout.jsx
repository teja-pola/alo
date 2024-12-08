import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CheckoutLayout = ({ children, currentStep }) => {
  const steps = [
    { id: 'plan', name: 'Plan Selection' },
    { id: 'details', name: 'Delivery Details' },
    { id: 'payment', name: 'Payment' },
    { id: 'confirmation', name: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              ALO
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
              >
                {index !== steps.length - 1 && (
                  <div className="absolute top-4 right-0 hidden sm:block w-full h-0.5 bg-gray-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        steps.findIndex((s) => s.id === currentStep) > index
                          ? 'bg-primary-600'
                          : ''
                      }`}
                    />
                  </div>
                )}
                <div className="relative flex flex-col items-center">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      currentStep === step.id
                        ? 'bg-primary-600 text-white'
                        : steps.findIndex((s) => s.id === currentStep) > index
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-500 mt-2">
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

CheckoutLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.oneOf(['plan', 'details', 'payment', 'confirmation']).isRequired,
};

export default CheckoutLayout; 