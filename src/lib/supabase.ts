import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface RegistrationData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  roll_number: string;
  year: string;
  event_name: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

// Store registration data
export const storeRegistrationData = async (data: Omit<RegistrationData, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data: result, error } = await supabase
      .from('registrations')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error storing registration:', error);
    // Fallback to localStorage if Supabase fails
    const fallbackData = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const existingData = JSON.parse(localStorage.getItem('registrations') || '[]');
    existingData.push(fallbackData);
    localStorage.setItem('registrations', JSON.stringify(existingData));
    
    return fallbackData;
  }
};

// Update payment status
export const updatePaymentStatus = async (registrationId: string, status: 'completed' | 'failed') => {
  try {
    const { error } = await supabase
      .from('registrations')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', registrationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating payment status:', error);
    // Fallback to localStorage
    const existingData = JSON.parse(localStorage.getItem('registrations') || '[]');
    const updatedData = existingData.map((reg: any) => 
      reg.id === registrationId 
        ? { ...reg, payment_status: status, updated_at: new Date().toISOString() }
        : reg
    );
    localStorage.setItem('registrations', JSON.stringify(updatedData));
  }
};