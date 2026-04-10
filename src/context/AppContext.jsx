import React, { createContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('menu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('menu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const signInWithGoogle = async (role = 'customer') => {
    setIsLoggingIn(true);
    // Mocking a successful Google login with specific role
    setTimeout(() => {
      const mockUser = { 
        id: 'demo-user-' + Date.now(), 
        email: `${role}@premium.com`, 
        role: role,
        user_metadata: { 
          full_name: role === 'merchant' ? 'Al Baraka Kitchen' : role === 'admin' ? 'Master Admin' : 'Premium Gastronome',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
        } 
      };
      setUser(mockUser);
      localStorage.setItem('menu_user', JSON.stringify(mockUser));
      setIsLoggingIn(false);
    }, 800);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('menu_user');
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
      user, setUser, 
      signInWithGoogle, isLoggingIn, signOut
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
