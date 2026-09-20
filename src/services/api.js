import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.VITE_API_URL) {
    return window.__ENV__.VITE_API_URL;
  }
  try {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  } catch (e) {
    return 'http://localhost:5000/api';
  }
};

export const API_BASE_URL = getApiUrl();

export const apiClient = {
  get: async (endpoint) => {
    try {
      const res = await axios.get(`${API_BASE_URL}${endpoint}`, { timeout: 1500 });
      return res.data;
    } catch (err) {
      // Mock fallback when backend server is offline
    }
    return null;
  },

  post: async (endpoint, payload) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload, { timeout: 1500 });
      return res.data;
    } catch (err) {
      // Mock fallback
    }
    return { success: true, timestamp: new Date().toISOString(), payload };
  }
};
