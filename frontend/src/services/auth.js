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

export const auth = {
  async login(email, password) {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(userData) {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },

  async logout() {
    await axiosInstance.post('/auth/logout');
  },

  async getCurrentUser() {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await axiosInstance.put('/auth/profile', userData);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
}; 