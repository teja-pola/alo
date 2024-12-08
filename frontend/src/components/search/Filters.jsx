import React from 'react';
import PropTypes from 'prop-types';

const Filters = ({ filters, onChange }) => {
  const {
    priceRange,
    mealTypes: selectedMealTypes,
    dietaryPreferences,
    rating,
  } = filters;

  const mealTypeOptions = ['breakfast', 'lunch', 'dinner'];

  const handleMealTypeChange = (type, checked) => {
    const newMealTypes = checked
      ? [...selectedMealTypes, type]
      : selectedMealTypes.filter(t => t !== type);
    onChange({ mealTypes: newMealTypes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="heading-3">Price Range</h3>
        <div className="mt-4 space-y-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange}
            onChange={(e) => onChange({ priceRange: e.target.value })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₹0</span>
            <span>₹{priceRange}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="heading-3">Meal Types</h3>
        <div className="mt-4 space-y-2">
          {mealTypeOptions.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={selectedMealTypes.includes(type)}
                onChange={(e) => handleMealTypeChange(type, e.target.checked)}
              />
              <span className="filter-label capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="heading-3">Dietary Preferences</h3>
        <div className="mt-4 space-y-2">
          {['vegetarian', 'vegan', 'non-vegetarian'].map((pref) => (
            <label key={pref} className="flex items-center">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={dietaryPreferences.includes(pref)}
                onChange={(e) => {
                  const newPrefs = e.target.checked
                    ? [...dietaryPreferences, pref]
                    : dietaryPreferences.filter((p) => p !== pref);
                  onChange({ dietaryPreferences: newPrefs });
                }}
              />
              <span className="filter-label capitalize">{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="heading-3">Minimum Rating</h3>
        <div className="mt-4">
          <select
            value={rating}
            onChange={(e) => onChange({ rating: e.target.value })}
            className="form-input"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    priceRange: PropTypes.number,
    mealTypes: PropTypes.arrayOf(PropTypes.string),
    dietaryPreferences: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Filters; 