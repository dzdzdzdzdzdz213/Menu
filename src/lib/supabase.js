import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn('⚠️ Supabase keys are missing. Please check your .env file.');
}

// Create the client with extra safety
export const supabase = createClient(
  supabaseUrl || 'https://missing.supabase.co', 
  supabaseAnonKey || 'missing',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder');
