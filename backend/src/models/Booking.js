const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan',
    required: [true, 'Meal plan ID is required'],
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required'],
  },
  subscriptionDetails: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: String,
      enum: {
        values: ['1month', '2months', '6months', '12months'],
        message: 'Invalid subscription duration',
      },
      required: [true, 'Duration is required'],
    },
    mealType: {
      type: String,
      enum: {
        values: ['breakfast', 'lunch', 'dinner'],
        message: 'Invalid meal type',
      },
      required: [true, 'Meal type is required'],
    },
  },
  deliveryOption: {
    type: String,
    enum: {
      values: ['delivery', 'dine-in'],
      message: 'Invalid delivery option',
    },
    required: [true, 'Delivery option is required'],
  },
  deliveryAddress: {
    name: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'Name is required for delivery',
      ],
    },
    phoneNumber: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'Phone number is required for delivery',
      ],
    },
    street: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'Street address is required for delivery',
      ],
    },
    city: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'City is required for delivery',
      ],
    },
    state: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'State is required for delivery',
      ],
    },
    zipCode: {
      type: String,
      required: [
        function() { return this.deliveryOption === 'delivery'; },
        'ZIP code is required for delivery',
      ],
    },
  },
  paymentDetails: {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['card', 'upi', 'cod'],
        message: 'Invalid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded'],
        message: 'Invalid payment status',
      },
      default: 'pending',
    },
    transactionId: String,
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'expired', 'cancelled'],
      message: 'Invalid booking status',
    },
    default: 'active',
  },
}, {
  timestamps: true,
});

// Indexes
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'subscriptionDetails.startDate': 1 });
bookingSchema.index({ 'subscriptionDetails.endDate': 1 });
bookingSchema.index({ 'paymentDetails.paymentStatus': 1 });

// Pre-save middleware to validate dates
bookingSchema.pre('save', function(next) {
  if (this.subscriptionDetails.endDate <= this.subscriptionDetails.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Methods
bookingSchema.methods.canCancel = function() {
  const now = new Date();
  const startDate = new Date(this.subscriptionDetails.startDate);
  return this.status === 'active' && startDate > now;
};

bookingSchema.methods.calculateRefundAmount = function() {
  if (!this.canCancel()) return 0;

  const now = new Date();
  const startDate = new Date(this.subscriptionDetails.startDate);
  const endDate = new Date(this.subscriptionDetails.endDate);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const remainingDays = (endDate - now) / (1000 * 60 * 60 * 24);
  
  return Math.round((remainingDays / totalDays) * this.paymentDetails.amount);
};

module.exports = mongoose.model('Booking', bookingSchema); 