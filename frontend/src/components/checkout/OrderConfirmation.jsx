import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';

const OrderConfirmation = ({ orderDetails }) => {
  const {
    orderId,
    restaurant,
    mealPlan,
    selectedOptions,
    deliveryDetails,
    amount,
    startDate,
  } = orderDetails;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="mt-2 text-gray-600">
          Thank you for subscribing to our meal plan. Your order has been confirmed.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Order ID</dt>
                  <dd className="text-sm font-medium text-gray-900">{orderId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Restaurant</dt>
                  <dd className="text-sm font-medium text-gray-900">{restaurant.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Meal Plan</dt>
                  <dd className="text-sm font-medium text-gray-900">{mealPlan.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Duration</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {selectedOptions.duration === 'monthly' ? '1 Month' :
                     selectedOptions.duration === 'quarterly' ? '3 Months' :
                     selectedOptions.duration === 'halfYearly' ? '6 Months' : '12 Months'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Start Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(startDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Meal Type</dt>
                  <dd className="text-sm font-medium text-gray-900 capitalize">
                    {selectedOptions.mealType}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Delivery Option</dt>
                  <dd className="text-sm font-medium text-gray-900 capitalize">
                    {selectedOptions.deliveryOption}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Delivery Details */}
          {selectedOptions.deliveryOption === 'delivery' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delivery Details</h3>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  {deliveryDetails.name}<br />
                  {deliveryDetails.street}<br />
                  {deliveryDetails.city}, {deliveryDetails.state} {deliveryDetails.zipCode}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Phone: {deliveryDetails.phoneNumber}
                </p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Total Amount</span>
                <span className="text-base font-medium text-gray-900">₹{amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link to="/subscriptions">
              <Button variant="outline">View My Subscriptions</Button>
            </Link>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderConfirmation.propTypes = {
  orderDetails: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    restaurant: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    mealPlan: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    selectedOptions: PropTypes.shape({
      duration: PropTypes.string.isRequired,
      mealType: PropTypes.string.isRequired,
      deliveryOption: PropTypes.string.isRequired,
    }).isRequired,
    deliveryDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zipCode: PropTypes.string,
      phoneNumber: PropTypes.string.isRequired,
    }).isRequired,
    amount: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderConfirmation; 