import { supabase } from '../lib/supabase';

export const requestService = {
  // Submit new request (cashier)
  async submitRequest(requestData) {
    const { data, error } = await supabase
      .from('requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's own requests (cashier)
  async getUserRequests(userId) {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        approved_by_user:approved_by(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all requests (admin/manager)
  async getAllRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        user:user_id(name, username),
        approved_by_user:approved_by(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update request status (admin/manager)
  async updateRequestStatus(requestId, status, approvedBy) {
    const { data, error } = await supabase
      .from('requests')
      .update({
        status,
        approved_by: approvedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};