import React from 'react';
import PropTypes from 'prop-types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Check if Stripe key is available
if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is missing. Please check your environment variables.');
}

const STRIPE_OPTIONS = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
    },
  ],
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4c64ff',
      colorBackground: '#ffffff',
      colorText: '#32325d',
      colorDanger: '#fa755a',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px',
    },
  },
};

const StripeProvider = ({ children }) => {
  // Show error message if Stripe key is missing
  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        Error: Stripe configuration is missing. Please check your environment variables.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={STRIPE_OPTIONS}>
      {children}
    </Elements>
  );
};

StripeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StripeProvider; 