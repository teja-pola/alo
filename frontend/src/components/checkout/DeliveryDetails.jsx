import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';

const DeliveryDetails = ({ deliveryOption, onBack, onNext }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    specialInstructions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {deliveryOption === 'delivery' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900">Delivery Address</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <Input
                    id="street"
                    name="street"
                    label="Street Address"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Input
                  id="city"
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="state"
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="zipCode"
                  name="zipCode"
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
            <div className="mt-4">
              <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Any special requests or dietary requirements..."
                value={formData.specialInstructions}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back to Plan Selection
            </Button>
            <Button type="submit">
              Continue to Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

DeliveryDetails.propTypes = {
  deliveryOption: PropTypes.oneOf(['delivery', 'dine-in']).isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default DeliveryDetails; 