import axios from 'axios';

const API_BASE_URL = 'http://localhost:3025/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Add JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response.data;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('🔴 Unauthorized - Logging out');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email, password) => {
    console.log('🔄 Attempting login:', email);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response);
      
      // Store token and user data
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('✅ Login successful for:', response.user.role, response.user.brand_name || 'Admin');
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export const campaigns = {
  list: async () => api.get('/campaigns/list'),
  get: async (id) => api.get(`/campaigns/${id}`),
  getStats: async () => api.get('/campaigns/stats')
};

export const isAuthenticated = () => !!localStorage.getItem('access_token');
export const getCurrentUser = () => JSON.parse(localStorage.getItem('user') || '{}');
export const isAggregatorAdmin = () => getCurrentUser()?.role === 'aggregator_admin';
export const isBrandUser = () => getCurrentUser()?.role === 'brand_user';

export default api;
