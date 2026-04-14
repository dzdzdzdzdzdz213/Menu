import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('menu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth Session
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId, retries = 5) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setUserProfile(data);
          return data;
        }

        // Profile row not yet created by trigger — wait and retry
        if (attempt < retries - 1) {
          await new Promise(res => setTimeout(res, 600 * (attempt + 1)));
          continue;
        }

        // Final attempt: upsert a skeleton profile so the user isn't stuck
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: upserted, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
              avatar_url: authUser.user_metadata?.avatar_url || '',
              role: 'user',
            }, { onConflict: 'id' })
            .select()
            .single();

          if (!upsertError && upserted) {
            setUserProfile(upserted);
            return upserted;
          }
          console.warn('Profile upsert failed:', upsertError?.message);
        }
      } catch (err) {
        console.error('Error fetching profile (attempt', attempt + 1, '):', err);
      }
    }
  };

  const signInWithGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Failed to sign in with Google');
      setIsLoggingIn(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (err) {
      toast.error('Error signing out');
    }
  };

  const trackEvent = useCallback(async (type, sellerId, productId = null) => {
    if (!sellerId) return;
    
    // Deduplicate visits in the same session
    if (type === 'visit') {
      const storageKey = `visited_${sellerId}`;
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, '1');
    }

    try {
      await supabase.from('analytics').insert({
        event_type: type,
        seller_id: sellerId,
        product_id: productId,
        user_id: user?.id
      });
    } catch (err) {
      console.error('Tracking failed:', err);
    }
  }, [user?.id]);

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].merchant_id !== item.merchant_id) {
       if (window.confirm("You already have items from another restaurant in your cart. Would you like to clear your cart and start a new order?")) {
           const newCart = [{ ...item, cartId: Date.now() }];
           setCart(newCart);
           localStorage.setItem('menu_cart', JSON.stringify(newCart));
           setIsCartOpen(true);
       }
       return;
    }
    const newCart = [...cart, { ...item, cartId: Date.now() }];
    setCart(newCart);
    localStorage.setItem('menu_cart', JSON.stringify(newCart));
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter(item => item.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem('menu_cart', JSON.stringify(newCart));
  };

  return (
    <AppContext.Provider value={{ 
      isCartOpen, setIsCartOpen, 
      cart, addToCart, removeFromCart,
      user, userProfile, setUser, 
      signInWithGoogle, isLoggingIn, signOut,
      loading, fetchProfile, trackEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
