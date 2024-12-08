import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    images,
    rating,
    cuisine,
    location,
    features,
  } = restaurant;

  return (
    <Link to={`/restaurants/${_id}`}>
      <Card hover className="h-full">
        <div className="relative">
          <img
            src={images[0]?.url || '/placeholder-restaurant.jpg'}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {rating && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium">{rating.average.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>{location.address.city}</p>
            <p className="mt-1">{cuisine.join(', ')}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      })
    ),
    rating: PropTypes.shape({
      average: PropTypes.number,
      count: PropTypes.number,
    }),
    cuisine: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({
      address: PropTypes.shape({
        city: PropTypes.string,
      }),
    }),
    features: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default RestaurantCard; 