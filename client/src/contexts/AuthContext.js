import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const getCurrentUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to get current user:', error);
      logout(false); // Don't show toast for auto-logout
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: registeredUser } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(registeredUser);
      
      showToast(`Account created successfully! Welcome, ${registeredUser.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = (showNotification = true) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (showNotification) {
      showToast('You have been logged out successfully.', 'info');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isInstructor: user?.role === 'instructor',
    isStudent: user?.role === 'student',
    toast,
    showToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };