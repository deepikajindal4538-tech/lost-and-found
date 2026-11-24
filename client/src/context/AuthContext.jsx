import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('campuskhoj_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and check user session
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('campuskhoj_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('campuskhoj_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('campuskhoj_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
        return { success: true, user: data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('campuskhoj_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Registration successful! Welcome to CampusKhoj.');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('campuskhoj_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/auth/profile', formData);
      if (data.success) {
        setUser((prev) => ({ ...prev, ...data.user }));
        toast.success('Profile updated successfully.');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update profile.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
