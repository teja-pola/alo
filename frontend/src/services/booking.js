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

export const booking = {
  async createSubscription(subscriptionData) {
    const response = await axiosInstance.post('/bookings', subscriptionData);
    return response.data;
  },

  async getSubscriptions() {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },

  async getSubscriptionById(id) {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  async cancelSubscription(id) {
    const response = await axiosInstance.post(`/bookings/${id}/cancel`);
    return response.data;
  },

  async updateDeliveryDetails(id, deliveryDetails) {
    const response = await axiosInstance.put(`/bookings/${id}/delivery`, deliveryDetails);
    return response.data;
  },
}; 