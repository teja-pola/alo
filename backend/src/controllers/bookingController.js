const Booking = require('../models/Booking');
const MealPlan = require('../models/MealPlan');
const { payment } = require('../services/payment');

exports.createBooking = async (req, res) => {
  try {
    const {
      mealPlanId,
      selectedOptions,
      deliveryDetails,
      paymentDetails,
    } = req.body;

    // Verify meal plan exists and is active
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      active: true,
    }).populate('restaurantId');

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found or inactive' });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    switch (selectedOptions.duration) {
      case '1month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '2months':
        endDate.setMonth(endDate.getMonth() + 2);
        break;
      case '6months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '12months':
        endDate.setMonth(endDate.getMonth() + 12);
        break;
      default:
        return res.status(400).json({ message: 'Invalid duration' });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      mealPlanId,
      restaurantId: mealPlan.restaurantId._id,
      subscriptionDetails: {
        startDate,
        endDate,
        duration: selectedOptions.duration,
        mealType: selectedOptions.mealType,
      },
      deliveryOption: selectedOptions.deliveryOption,
      deliveryAddress: deliveryDetails,
      paymentDetails: {
        amount: selectedOptions.price,
        paymentMethod: paymentDetails.type,
        paymentStatus: paymentDetails.type === 'cod' ? 'pending' : 'completed',
        transactionId: paymentDetails.paymentMethodId,
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('mealPlanId', 'name type category')
      .populate('restaurantId', 'name location');

    const total = await Booking.countDocuments(query);

    res.json({
      data: bookings,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate('mealPlanId')
      .populate('restaurantId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'active',
    });

    if (!booking) {
      return res.status(404).json({ message: 'Active booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Handle refund logic here if needed

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDeliveryDetails = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'active',
    });

    if (!booking) {
      return res.status(404).json({ message: 'Active booking not found' });
    }

    booking.deliveryAddress = deliveryAddress;
    await booking.save();

    res.json({
      message: 'Delivery details updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 