// import { createClient } from '@supabase/supabase-js';

const MOCK_STORAGE_KEY = 'menu_products_db';

const getMockData = () => {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Default Seed Initial State
  const seed = [
    { id: '1', name: 'Premium Angus Burger', price: 1200, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
    { id: '2', name: 'Spicy Chicken Wings', price: 850, image_url: 'https://images.unsplash.com/photo-1524114664604-cd8133cd671d?auto=format&fit=crop&q=80&w=800' }
  ];
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const saveMockData = (data) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

export const supabase = {
  from: (table) => {
    if (table === 'products') {
      return {
        select: async () => {
          return { data: getMockData(), error: null };
        },
        insert: async (arr) => {
          const current = getMockData();
          const newItems = arr.map(item => ({ ...item, id: Math.random().toString(36).substr(2, 9) }));
          saveMockData([...current, ...newItems]);
          return { data: newItems, error: null };
        },
        delete: () => {
          return {
            eq: async (field, val) => {
              const current = getMockData();
              const filtered = current.filter(item => item[field] !== val);
              saveMockData(filtered);
              return { data: null, error: null };
            }
          }
        }
      }
    }
  },
  auth: {
    // mock just in case AppContext touches it
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null })
  }
};
