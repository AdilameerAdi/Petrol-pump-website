import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession({ user: { id: userData.id } });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Find user by username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Verify password using bcrypt
      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      
      if (!isValidPassword) {
        return { success: false, message: 'Invalid credentials' };
      }
      
      // Set user data directly and store in localStorage
      setUser(userData);
      setSession({ user: { id: userData.id } });
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Navigate to home after successful login
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);

      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setSession(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};