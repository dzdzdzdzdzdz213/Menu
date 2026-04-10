import React, { createContext, useState, useEffect } from 'react';
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

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If profile doesn't exist yet, we'll wait for the trigger or creation
        console.warn('Profile not found yet for user:', userId);
        return;
      }
      setUserProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/account',
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Failed to sign in');
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

  const trackEvent = async (type, sellerId, productId = null) => {
    if (!sellerId) return;
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
  };

  const addToCart = (item) => {
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
