import { supabase } from '../lib/supabase';

export const salesService = {
  // Save complete sales record
  async saveSalesRecord(salesData) {
    const { data, error } = await supabase
      .from('sales_records')
      .insert([salesData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's sales records
  async getUserSalesRecords(userId) {
    const { data, error } = await supabase
      .from('sales_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all sales records (admin/manager)
  async getAllSalesRecords() {
    const { data, error } = await supabase
      .from('sales_records')
      .select(`
        *,
        user:user_id(name, username)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get sales records by date range
  async getSalesRecordsByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales_records')
      .select(`
        *,
        user:user_id(name, username)
      `)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};