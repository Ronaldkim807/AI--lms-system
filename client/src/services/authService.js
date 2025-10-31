import API from '../api/axios';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      console.log('Login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      console.log('Register API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error.response?.data);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      console.log('Current user API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Current user API error:', error.response?.data);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default API;