import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Robust initialization to prevent "Black Screen" on invalid env vars
let supabaseInstance;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
     console.error('⚠️ CRITICAL STARTUP WARNING ⚠️');
     console.error('Supabase VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing from your environment variables.');
     console.error('The application will fall back to using a local mock client, but real database queries will fail.');
  }

  if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase: Invalid or missing credentials. Using robust mock client for testing.');
    supabaseInstance = {
      auth: {
        getSession: async () => {
          const stored = localStorage.getItem('mock-session');
          return { data: { session: stored ? JSON.parse(stored) : null }, error: null };
        },
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => {
          const mockSession = { user: { id: 'mock-123', email: 'merchant@menu.app', user_metadata: { full_name: 'Demo Merchant Profile' } } };
          localStorage.setItem('mock-session', JSON.stringify(mockSession));
          window.location.reload();
          return { error: null };
        },
        signOut: async () => {
          localStorage.removeItem('mock-session');
          window.location.reload();
          return { error: null };
        },
      },
      from: () => ({
        select: () => ({
          eq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }),
          limit: () => ({ data: [], error: null }),
          ilike: () => ({ eq: () => ({ data: [], error: null }) }),
        }),
      }),
    };
  }
} catch (err) {
  console.error('Supabase initialization failed:', err);
  supabaseInstance = { auth: {}, from: () => {} }; // Ultimate fallback
}

export const supabase = supabaseInstance;
