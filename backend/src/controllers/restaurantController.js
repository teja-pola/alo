const Restaurant = require('../models/Restaurant');
const MealPlan = require('../models/MealPlan');

exports.searchRestaurants = async (req, res) => {
  try {
    const {
      location,
      cuisine,
      features,
      rating,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Location search
    if (location) {
      query['location.address.city'] = new RegExp(location, 'i');
    }

    // Cuisine filter
    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    // Features filter
    if (features) {
      query.features = { $all: features.split(',') };
    }

    // Rating filter
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

    const total = await Restaurant.countDocuments(query);

    res.json({
      data: restaurants,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const restaurant = await Restaurant.findById(req.params.id)
      .select('reviews')
      .slice('reviews', [skip, parseInt(limit)])
      .populate('reviews.userId', 'firstName lastName profileImage');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      data: restaurant.reviews,
      page: parseInt(page),
      totalPages: Math.ceil(restaurant.reviews.length / limit),
      total: restaurant.reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user has already reviewed
    const existingReview = restaurant.reviews.find(
      review => review.userId.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    // Add review
    restaurant.reviews.push({
      userId: req.user.id,
      rating,
      comment,
    });

    // Update average rating
    const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
    restaurant.rating = {
      average: totalRating / restaurant.reviews.length,
      count: restaurant.reviews.length,
    };

    await restaurant.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 