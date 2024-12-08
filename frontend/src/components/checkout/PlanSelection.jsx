import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const PlanSelection = ({ mealPlan, onNext }) => {
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [selectedMealType, setSelectedMealType] = useState(mealPlan.type);
  const [deliveryOption, setDeliveryOption] = useState('delivery');

  const durations = [
    { id: 'monthly', name: '1 Month', price: mealPlan.price.monthly },
    { id: 'quarterly', name: '3 Months', price: mealPlan.price.quarterly },
    { id: 'halfYearly', name: '6 Months', price: mealPlan.price.halfYearly },
    { id: 'yearly', name: '12 Months', price: mealPlan.price.yearly },
  ];

  const handleContinue = () => {
    onNext({
      duration: selectedDuration,
      mealType: selectedMealType,
      deliveryOption,
      price: durations.find(d => d.id === selectedDuration).price
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Plan Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{mealPlan.name}</h2>
          <p className="mt-2 text-gray-600">{mealPlan.description}</p>
        </div>

        {/* Subscription Duration */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Select Duration</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {durations.map((duration) => (
              <label
                key={duration.id}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedDuration === duration.id
                    ? 'border-primary-600 ring-2 ring-primary-600'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="duration"
                  value={duration.id}
                  checked={selectedDuration === duration.id}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="sr-only"
                />
                <div className="flex flex-1">
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {duration.name}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      ₹{duration.price}/month
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Meal Type Selection */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Meal Type</h3>
          <div className="mt-4">
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Delivery Option</h3>
          <div className="mt-4 space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryOption"
                value="delivery"
                checked={deliveryOption === 'delivery'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">Home Delivery</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryOption"
                value="dine-in"
                checked={deliveryOption === 'dine-in'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">Dine-in</span>
            </label>
          </div>
        </div>

        {/* Summary and Action */}
        <div className="px-6 py-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total monthly price</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{durations.find(d => d.id === selectedDuration).price}
              </p>
            </div>
            <Button onClick={handleContinue}>
              Continue to Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

PlanSelection.propTypes = {
  mealPlan: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.shape({
      monthly: PropTypes.number.isRequired,
      quarterly: PropTypes.number.isRequired,
      halfYearly: PropTypes.number.isRequired,
      yearly: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PlanSelection; 