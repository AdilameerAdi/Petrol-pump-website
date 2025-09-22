import { supabase } from '../lib/supabase';

export const rateService = {
  // Get current rates
  async getRates() {
    const { data, error } = await supabase
      .from('fuel_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Return default rates if no data found
      return {
        MS: 95.50,
        MSP: 98.20,
        HSD: 87.30,
        CNG: 65.40
      };
    }
    
    return data.rates;
  },

  // Save new rates (admin only)
  async saveRates(rates) {
    const { data, error } = await supabase
      .from('fuel_rates')
      .insert([{
        rates: rates,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};