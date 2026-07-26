import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase client - can be replaced with your own backend
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Health check to verify connection
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('assets').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}
