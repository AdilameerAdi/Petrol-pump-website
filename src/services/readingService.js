import { supabase } from '../lib/supabase';

export const readingService = {
  // Save previous readings (admin)
  async savePreviousReadings(readings) {
    const { data, error } = await supabase
      .from('previous_readings')
      .upsert(
        Object.entries(readings).map(([nozzle, reading]) => ({
          nozzle_name: nozzle,
          previous_reading: reading,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'nozzle_name' }
      );

    if (error) throw error;
    return data;
  },

  // Get previous readings (cashier)
  async getPreviousReadings(nozzles) {
    const { data, error } = await supabase
      .from('previous_readings')
      .select('nozzle_name, previous_reading')
      .in('nozzle_name', nozzles);

    if (error) throw error;
    
    // Convert array to object for easier access
    const readingsObj = {};
    data.forEach(item => {
      readingsObj[item.nozzle_name] = item.previous_reading;
    });
    
    return readingsObj;
  }
};