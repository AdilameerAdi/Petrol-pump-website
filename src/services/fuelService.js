import { supabase } from '../lib/supabase';

export const fuelService = {
  // Get current fuel quantities
  async getFuelQuantities() {
    const { data, error } = await supabase
      .from('fuel_quantities')
      .select('*')
      .order('fuel_type');

    if (error) throw error;
    
    // Convert array to object for easier access
    const quantities = {};
    data.forEach(item => {
      quantities[item.fuel_type] = parseFloat(item.quantity);
    });
    
    return quantities;
  },

  // Update fuel quantities
  async updateFuelQuantities(quantities, userId) {
    const updates = Object.entries(quantities).map(([fuelType, quantity]) => ({
      fuel_type: fuelType,
      quantity: quantity,
      updated_by: userId,
      updated_at: new Date().toISOString()
    }));

    // Delete existing records and insert new ones
    await supabase.from('fuel_quantities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data, error } = await supabase
      .from('fuel_quantities')
      .insert(updates)
      .select();

    if (error) throw error;
    return data;
  },

  // Get fuel density readings
  async getFuelDensity() {
    const { data, error } = await supabase
      .from('fuel_density')
      .select('*')
      .order('fuel_type');

    if (error) throw error;
    
    // Convert array to object for easier access
    const density = {};
    data.forEach(item => {
      density[item.fuel_type] = {
        hydrometer_reading: parseFloat(item.hydrometer_reading),
        temperature: parseFloat(item.temperature)
      };
    });
    
    return density;
  },

  // Update fuel density readings
  async updateFuelDensity(densityData, userId) {
    const updates = Object.entries(densityData).map(([fuelType, data]) => ({
      fuel_type: fuelType,
      hydrometer_reading: data.hydrometer_reading,
      temperature: data.temperature,
      updated_by: userId,
      updated_at: new Date().toISOString()
    }));

    // Delete existing records and insert new ones
    await supabase.from('fuel_density').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data, error } = await supabase
      .from('fuel_density')
      .insert(updates)
      .select();

    if (error) throw error;
    return data;
  }
};