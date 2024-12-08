import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from '../common/Button';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const PaymentForm = ({ amount, onBack, onNext }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        setLoading(false);
        return;
      }

      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      onNext({ type: 'card', paymentMethodId: stripePaymentMethod.id });
    } else {
      onNext({ type: paymentMethod });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Credit/Debit Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">UPI</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Card Details</h3>
              <div className="p-4 border border-gray-300 rounded-md">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">UPI Payment</h3>
              <p className="text-sm text-gray-600">
                You will be redirected to complete the UPI payment after confirming the order.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-lg font-medium text-gray-900">₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || (paymentMethod === 'card' && (!stripe || !elements))}
              >
                {loading ? 'Processing...' : 'Confirm Payment'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

PaymentForm.propTypes = {
  amount: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PaymentForm; 