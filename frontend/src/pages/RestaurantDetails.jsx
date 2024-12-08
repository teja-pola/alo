import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getRestaurantMealPlans } from '../services/restaurant';
import MealPlanCard from '../components/restaurant/MealPlanCard';
import RestaurantInfo from '../components/restaurant/RestaurantInfo';
import ReviewSection from '../components/restaurant/ReviewSection';
import Button from '../components/common/Button';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantData, mealPlansData] = await Promise.all([
          getRestaurantById(id),
          getRestaurantMealPlans(id),
        ]);
        setRestaurant(restaurantData);
        setMealPlans(mealPlansData);
      } catch (error) {
        console.error('Failed to fetch restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Restaurant Image */}
      <div className="relative h-96">
        <img
          src={restaurant.images[0]?.url || '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="text-white">
              <h1 className="text-4xl font-bold">{restaurant.name}</h1>
              <p className="mt-2 text-lg">{restaurant.cuisine.join(' • ')}</p>
              <div className="mt-4 flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium">{restaurant.rating.average.toFixed(1)}</span>
                <span className="mx-2">•</span>
                <span>{restaurant.rating.count} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['menu', 'info', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mealPlans.map((mealPlan) => (
              <MealPlanCard key={mealPlan._id} mealPlan={mealPlan} />
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <RestaurantInfo restaurant={restaurant} />
        )}

        {activeTab === 'reviews' && (
          <ReviewSection restaurantId={id} />
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails; 