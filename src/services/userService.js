import { supabase } from '../lib/supabase';

export const userService = {
  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, name, mobile, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create new user (admin only)
  async createUser(userData) {
    // Hash password before storing
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.name,
        mobile: userData.mobile || null,
        role: userData.role || 'user'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: profileData.name,
        email: profileData.email,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update username
  async updateUsername(userId, newUsername) {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: newUsername,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update password
  async updatePassword(userId, newPassword) {
    // Hash new password before storing
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { data, error } = await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};