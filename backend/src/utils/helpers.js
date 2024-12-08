const crypto = require('crypto');

exports.generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

exports.calculateSubscriptionEndDate = (startDate, duration) => {
  const date = new Date(startDate);
  switch (duration) {
    case '1month':
      date.setMonth(date.getMonth() + 1);
      break;
    case '2months':
      date.setMonth(date.getMonth() + 2);
      break;
    case '6months':
      date.setMonth(date.getMonth() + 6);
      break;
    case '12months':
      date.setMonth(date.getMonth() + 12);
      break;
    default:
      throw new Error('Invalid duration');
  }
  return date;
};

exports.isValidIndianPhoneNumber = (phoneNumber) => {
  return /^[6-9]\d{9}$/.test(phoneNumber);
};

exports.isValidPinCode = (pinCode) => {
  return /^[1-9][0-9]{5}$/.test(pinCode);
};

exports.sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};

exports.calculateProratedRefund = (amount, startDate, endDate, cancelDate) => {
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const remainingDays = (endDate - cancelDate) / (1000 * 60 * 60 * 24);
  return Math.round((remainingDays / totalDays) * amount);
};

exports.generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString().substr(2, 4);
  return `ORD${timestamp}${random}`;
};

exports.parseQueryFilters = (query) => {
  const filters = {};
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Remove pagination params and parse remaining filters
  delete query.page;
  delete query.limit;

  Object.keys(query).forEach(key => {
    if (query[key]) {
      if (key.includes(',')) {
        filters[key] = { $in: query[key].split(',') };
      } else if (key.endsWith('Min')) {
        const realKey = key.replace('Min', '');
        filters[realKey] = { ...filters[realKey], $gte: parseFloat(query[key]) };
      } else if (key.endsWith('Max')) {
        const realKey = key.replace('Max', '');
        filters[realKey] = { ...filters[realKey], $lte: parseFloat(query[key]) };
      } else {
        filters[key] = query[key];
      }
    }
  });

  return { filters, pagination: { page, limit, skip } };
};

exports.handleAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 