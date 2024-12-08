import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const payment = {
  async createPaymentIntent(bookingData) {
    const response = await axiosInstance.post('/payments/create-intent', bookingData);
    return response.data;
  },

  async confirmPayment(paymentIntentId, paymentMethodId) {
    const response = await axiosInstance.post('/payments/confirm', {
      paymentIntentId,
      paymentMethodId,
    });
    return response.data;
  },

  async initiateUPIPayment(bookingData) {
    const response = await axiosInstance.post('/payments/upi/initiate', bookingData);
    return response.data;
  },

  async verifyUPIPayment(transactionId) {
    const response = await axiosInstance.post('/payments/upi/verify', {
      transactionId,
    });
    return response.data;
  },
}; 