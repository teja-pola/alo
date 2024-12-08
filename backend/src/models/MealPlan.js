const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Meal plan name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  type: {
    type: String,
    enum: {
      values: ['breakfast', 'lunch', 'dinner'],
      message: 'Invalid meal type',
    },
    required: [true, 'Meal type is required'],
  },
  category: {
    type: String,
    enum: {
      values: ['vegetarian', 'vegan', 'non-vegetarian'],
      message: 'Invalid meal category',
    },
    required: [true, 'Meal category is required'],
  },
  price: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quarterly: {
      type: Number,
      required: [true, 'Quarterly price is required'],
      min: [0, 'Price cannot be negative'],
    },
    halfYearly: {
      type: Number,
      required: [true, 'Half-yearly price is required'],
      min: [0, 'Price cannot be negative'],
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  menuItems: [{
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
    },
    description: String,
    image: String,
    allergens: [String],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
    },
  }],
  availability: {
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    daysAvailable: {
      type: [String],
      enum: {
        values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        message: 'Invalid day',
      },
      required: [true, 'Available days are required'],
    },
  },
  isDeliveryAvailable: {
    type: Boolean,
    default: true,
  },
  isDineInAvailable: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  minimumSubscriptionDays: {
    type: Number,
    default: 30,
    min: [7, 'Minimum subscription days cannot be less than 7'],
  },
}, {
  timestamps: true,
});

// Indexes
mealPlanSchema.index({ type: 1 });
mealPlanSchema.index({ category: 1 });
mealPlanSchema.index({ 'price.monthly': 1 });
mealPlanSchema.index({ active: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema); 