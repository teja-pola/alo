import React from 'react';
import PropTypes from 'prop-types';

const RestaurantInfo = ({ restaurant }) => {
  const {
    description,
    location,
    contact,
    operatingHours,
    features,
  } = restaurant;

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow divide-y">
      {/* Description Section */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">About</h3>
        <p className="mt-4 text-gray-600">{description}</p>
      </div>

      {/* Location & Contact Section */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Location & Contact</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Address</h4>
            <p className="mt-2 text-gray-600">
              {location.address.street}<br />
              {location.address.city}, {location.address.state} {location.address.zipCode}<br />
              {location.address.country}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Contact</h4>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600">Phone: {contact.phone}</p>
              <p className="text-gray-600">Email: {contact.email}</p>
              {contact.website && (
                <p className="text-gray-600">
                  Website: <a href={contact.website} className="text-primary-600 hover:text-primary-500" target="_blank" rel="noopener noreferrer">{contact.website}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours Section */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Operating Hours</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between">
              <span className="text-gray-600 capitalize">{day}</span>
              <span className="text-gray-900">
                {hours.open && hours.close
                  ? `${formatTime(hours.open)} - ${formatTime(hours.close)}`
                  : 'Closed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Features</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

RestaurantInfo.propTypes = {
  restaurant: PropTypes.shape({
    description: PropTypes.string.isRequired,
    location: PropTypes.shape({
      address: PropTypes.shape({
        street: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        zipCode: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    contact: PropTypes.shape({
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      website: PropTypes.string,
    }).isRequired,
    operatingHours: PropTypes.objectOf(
      PropTypes.shape({
        open: PropTypes.string,
        close: PropTypes.string,
      })
    ).isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default RestaurantInfo; 