const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchRestaurants,
  getRestaurantById,
  getRestaurantReviews,
  submitReview,
} = require('../controllers/restaurantController');
const {
  getMealPlans,
  getMealPlanById,
  searchMealPlans,
} = require('../controllers/mealPlanController');

// Restaurant routes
router.get('/search', searchRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/reviews', getRestaurantReviews);
router.post('/:id/reviews', protect, submitReview);

// Meal plan routes
router.get('/:restaurantId/meal-plans', getMealPlans);
router.get('/meal-plans/:id', getMealPlanById);
router.get('/meal-plans/search', searchMealPlans);

module.exports = router; 