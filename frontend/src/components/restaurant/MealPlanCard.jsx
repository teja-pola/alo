import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const MealPlanCard = ({ mealPlan }) => {
  const navigate = useNavigate();
  const {
    _id,
    name,
    description,
    type,
    category,
    price,
    menuItems,
  } = mealPlan;

  const handleSubscribe = () => {
    navigate(`/checkout/meal-plan/${_id}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500 capitalize">{type} • {category}</p>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-900">₹{price.monthly}</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">{description}</p>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Menu Items</h4>
          <ul className="mt-2 space-y-2">
            {menuItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t">
        <Button onClick={handleSubscribe} className="w-full">
          Subscribe Now
        </Button>
      </div>
    </Card>
  );
};

MealPlanCard.propTypes = {
  mealPlan: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.shape({
      monthly: PropTypes.number.isRequired,
      quarterly: PropTypes.number.isRequired,
      halfYearly: PropTypes.number.isRequired,
      yearly: PropTypes.number.isRequired,
    }).isRequired,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default MealPlanCard; 