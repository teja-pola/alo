const { body } = require('express-validator');

exports.createBookingValidation = [
  body('mealPlanId')
    .notEmpty()
    .withMessage('Meal plan ID is required')
    .isMongoId()
    .withMessage('Invalid meal plan ID'),

  body('selectedOptions.duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isIn(['1month', '2months', '6months', '12months'])
    .withMessage('Invalid duration'),

  body('selectedOptions.mealType')
    .notEmpty()
    .withMessage('Meal type is required')
    .isIn(['breakfast', 'lunch', 'dinner'])
    .withMessage('Invalid meal type'),

  body('selectedOptions.deliveryOption')
    .notEmpty()
    .withMessage('Delivery option is required')
    .isIn(['delivery', 'dine-in'])
    .withMessage('Invalid delivery option'),

  body('deliveryDetails')
    .custom((value, { req }) => {
      if (req.body.selectedOptions.deliveryOption === 'delivery') {
        if (!value || !value.name || !value.phoneNumber || !value.street || 
            !value.city || !value.state || !value.zipCode) {
          throw new Error('Delivery details are required for delivery option');
        }
      }
      return true;
    }),

  body('paymentDetails.type')
    .notEmpty()
    .withMessage('Payment type is required')
    .isIn(['card', 'upi', 'cod'])
    .withMessage('Invalid payment type'),

  body('paymentDetails.paymentMethodId')
    .custom((value, { req }) => {
      if (req.body.paymentDetails.type === 'card' && !value) {
        throw new Error('Payment method ID is required for card payments');
      }
      return true;
    }),
];

exports.updateDeliveryDetailsValidation = [
  body('deliveryAddress.name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),

  body('deliveryAddress.phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Invalid phone number format'),

  body('deliveryAddress.street')
    .notEmpty()
    .withMessage('Street address is required')
    .trim(),

  body('deliveryAddress.city')
    .notEmpty()
    .withMessage('City is required')
    .trim(),

  body('deliveryAddress.state')
    .notEmpty()
    .withMessage('State is required')
    .trim(),

  body('deliveryAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required')
    .matches(/^[0-9]{6}$/)
    .withMessage('Invalid ZIP code format'),
]; 