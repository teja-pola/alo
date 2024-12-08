const MealPlan = require('../models/MealPlan');
const Restaurant = require('../models/Restaurant');

exports.getMealPlans = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const mealPlans = await MealPlan.find({ restaurantId, active: true });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('restaurantId', 'name location contact');

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchMealPlans = async (req, res) => {
  try {
    const {
      type,
      category,
      priceRange,
      location,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { active: true };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-');
      query['price.monthly'] = {
        $gte: parseInt(min),
        $lte: parseInt(max),
      };
    }

    let restaurantIds = [];
    if (location) {
      const restaurants = await Restaurant.find({
        'location.address.city': new RegExp(location, 'i'),
      }).select('_id');
      restaurantIds = restaurants.map(r => r._id);
      query.restaurantId = { $in: restaurantIds };
    }

    const skip = (page - 1) * limit;

    const mealPlans = await MealPlan.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('restaurantId', 'name location rating images');

    const total = await MealPlan.countDocuments(query);

    res.json({
      data: mealPlans,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 