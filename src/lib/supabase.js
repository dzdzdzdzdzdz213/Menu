// We use a local-storage mock backend to act as our database for the single Seller.
const LOCAL_STORAGE_KEY = 'menu_products_db';

const getProducts = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setProducts = (products) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

<<<<<<< HEAD
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
=======
// Create some default items if empty
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  setProducts([
    {
      id: 1,
      name: "Signature Burger",
      price: 850,
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Classic Pizza",
      price: 1200,
      image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      created_at: new Date().toISOString()
    }
  ]);
>>>>>>> b3dd1fa (multiple)
}

// Minimal mocked supabase object
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table) => {
    if (table === 'products') {
      return {
        select: (query) => {
          return {
            limit: () => ({ data: getProducts(), error: null }),
            then: (resolve) => resolve({ data: getProducts(), error: null })
          };
        },
        insert: (item) => {
          const products = getProducts();
          const newItem = {
            id: Date.now(),
            created_at: new Date().toISOString(),
            ...(Array.isArray(item) ? item[0] : item)
          };
          products.unshift(newItem);
          setProducts(products);
          return { error: null }; // Returning pseudo-promise via then if needed, or simple object
        },
        delete: () => {
          // simple delete chain matcher: eq('id', id)
          return {
            eq: (field, value) => {
              if (field === 'id') {
                const products = getProducts();
                setProducts(products.filter(p => String(p.id) !== String(value)));
              }
              return { error: null };
            }
          };
        }
      };
    }
    return {
      select: () => ({ limit: () => ({ data: [], error: null }) })
    };
  }
};
