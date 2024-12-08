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

export const searchRestaurants = async (params) => {
  const response = await axiosInstance.get('/restaurants/search', { params });
  return response.data;
};

export const getRestaurantById = async (id) => {
  const response = await axiosInstance.get(`/restaurants/${id}`);
  return response.data;
};

export const getRestaurantMealPlans = async (id) => {
  const response = await axiosInstance.get(`/restaurants/${id}/meal-plans`);
  return response.data;
};

export const getRestaurantReviews = async (id, params) => {
  const response = await axiosInstance.get(`/restaurants/${id}/reviews`, { params });
  return response.data;
};

export const submitRestaurantReview = async (id, reviewData) => {
  const response = await axiosInstance.post(`/restaurants/${id}/reviews`, reviewData);
  return response.data;
}; 