import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const TRANSLATIONS = {
  en: {
    home: 'Home',
    heritage: 'Heritage Gallery',
    merchants: 'Merchants',
    delivery: 'Delivery Hub',
    signIn: 'Sign In',
    trending: 'Trending Now',
    trendingSubtitle: 'Most ordered delicacies in your region',
    viewAll: 'View All',
    leaderboardTitle: 'Top 100',
    leaderboardBadge: 'Leaderboard',
    leaderboardSub: "Platform's highest-rated vendors this month",
    regular: 'Regular',
    traditional: 'Traditional',
    patisserie: 'Patisserie',
    rank: 'Rank',
    vendor: 'Vendor',
    region: 'Region',
    rating: 'Rating',
    orders: 'Orders',
    heroRegions: '🌍 Available Across 5 Regions',
    heroTitle1: 'Discover',
    heroHighlight: 'Premium',
    heroTitle2: 'Culinary Experiences',
    heroSub: 'Explore the finest selection of multi-vendor delicacies from traditional patisseries to modern gourmet cuisine.',
    exploreNow: 'Explore Now',
    scanOrder: 'Scan. Order.',
    enjoy: 'Enjoy.',
    scanDesc: 'Every restaurant on Menu generates a unique QR code. Scan at the table or share the link — your digital menu is always a tap away.',
    activeVendors: 'Active Vendors',
    dailyOrders: 'Daily Orders',
    avgRating: 'Avg. Rating',
    footerDesc: 'The premium multi-vendor food platform connecting the finest culinary experiences across North Africa, the Gulf, and Europe.',
    quickLinks: 'Quick Links',
    selectCountry: 'Select Country',
    selectLanguage: 'Language',
    footerRights: 'All rights reserved.',
    deliveryFleet: 'Menu Fleet',
    deliverySub: 'Join our elite network of freelance delivery drivers.',
    premiumRates: 'Premium Rates',
    premiumRatesSub: 'Earn competitive base rates plus 100% of your tips.',
    smartRouting: 'Smart Routing',
    smartRoutingSub: 'Our AI maps out the fastest delivery routes for you.',
    verifiedNetwork: 'Verified Network',
    verifiedNetworkSub: 'Work exclusively with our curated list of 500+ merchants.',
    driverApp: 'Driver Application',
    fullName: 'Full Legal Name',
    phoneNumber: 'Phone Number',
    cityOp: 'City of Operation',
    vehicleType: 'Vehicle Type',
    motorcycle: 'Motorcycle / Scooter',
    car: 'Car',
    bicycle: 'Bicycle',
    all: 'All',
    pizza: 'Pizza',
    sweets: 'Sweets',
    traditional_cat: 'Traditional',
    healthy: 'Healthy',
    burgers: 'Burgers',
    fastfood: 'Fast Food',
    seafood: 'Seafood',
    allDelicacies: 'All Delicacies',
    applyNow: 'Submit Application',
    successTitle: 'Application Submitted',
    successSub: 'Our onboarding team will review your profile shortly.',
    dir: 'ltr',
    inventory: 'Inventory',
    media: 'Media',
    liveOrders: 'Live Orders',
    addItem: 'Add Item',
  },
  fr: {
    home: 'Accueil',
    heritage: 'Galerie Patrimoine',
    merchants: 'Marchands',
    delivery: 'Hub Livraison',
    signIn: 'Connexion',
    trending: 'Tendances',
    trendingSubtitle: 'Plats les plus commandés dans votre région',
    viewAll: 'Voir Tout',
    leaderboardTitle: 'Top 100',
    leaderboardBadge: 'Classement',
    leaderboardSub: 'Les vendeurs les mieux notés de la plateforme ce mois',
    regular: 'Classique',
    traditional: 'Traditionnel',
    patisserie: 'Pâtisserie',
    rank: 'Rang',
    vendor: 'Vendeur',
    region: 'Région',
    rating: 'Note',
    orders: 'Commandes',
    heroRegions: '🌍 Disponible dans 5 régions',
    heroTitle1: 'Découvrez',
    heroHighlight: 'Premium',
    heroTitle2: 'Expériences Culinaires',
    heroSub: "Explorez la meilleure sélection de délicatesses multi-vendeurs, des pâtisseries traditionnelles à la grande cuisine moderne.",
    exploreNow: 'Explorer',
    activeVendors: 'Vendeurs Actifs',
    dailyOrders: 'Commandes/Jour',
    avgRating: 'Note Moy.',
    footerRights: 'Tous droits réservés.',
    dir: 'ltr',
    all: 'Tout',
    pizza: 'Pizza',
    sweets: 'Sucreries',
    traditional_cat: 'Traditionnel',
    healthy: 'Sain',
    burgers: 'Burgers',
    fastfood: 'Restauration Rapide',
    seafood: 'Fruits de Mer',
    inventory: 'Inventaire',
    media: 'Médiathèque',
    liveOrders: 'Commandes Directes',
    addItem: 'Ajouter',
  },
  ar: {
    home: 'الرئيسية',
    heritage: 'معرض التراث',
    merchants: 'التجار',
    delivery: 'مركز التوصيل',
    signIn: 'تسجيل الدخول',
    trending: 'الأكثر طلبًا',
    trendingSubtitle: 'أكثر الأطباق طلبًا في منطقتك',
    viewAll: 'عرض الكل',
    leaderboardTitle: 'أفضل 100',
    leaderboardBadge: 'تصنيف',
    leaderboardSub: 'أعلى البائعين تقييمًا هذا الشهر',
    regular: 'عادي',
    traditional: 'تقليدي',
    patisserie: 'حلويات',
    rank: 'الترتيب',
    vendor: 'البائع',
    region: 'المنطقة',
    rating: 'التقييم',
    orders: 'الطلبات',
    heroRegions: '🌍 متاح في 5 مناطق',
    heroTitle1: 'اكتشف',
    heroHighlight: 'المميز',
    heroTitle2: 'التجارب الذوقية',
    heroSub: 'استكشف أرقى تشكيلة من الأطباق المتعددة، من الحلويات التقليدية إلى المطبخ العالمي الفاخر.',
    exploreNow: 'استكشف الآن',
    activeVendors: 'تاجر نشط',
    dailyOrders: 'طلب يومي',
    avgRating: 'متوسط التقييم',
    footerRights: 'جميع الحقوق محفوظة.',
    dir: 'rtl',
    all: 'الكل',
    pizza: 'بيتزا',
    sweets: 'حلويات',
    traditional_cat: 'تقليدي',
    healthy: 'صحي',
    burgers: 'برجر',
    fastfood: 'وجبات سريعة',
    seafood: 'مأكولات بحرية',
    inventory: 'المخزون',
    media: 'مركز الوسائط',
    liveOrders: 'الطلبات المباشرة',
    addItem: 'إضافة منتج',
  }
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('menu-lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('menu-theme') || 'dark');
  const [country, setCountry] = useState('Algeria');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  
  // Real Auth State
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Safety check for session check
    if (supabase?.auth) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoggingIn(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase?.auth?.signInWithOAuth) return;
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/account'
      }
    });
    if (error) {
      console.error('Error logging in:', error.message);
      toast.error('Failed to log in. Please try again.');
      setIsLoggingIn(false);
    } else {
      toast.success('Successfully logged in.');
    }
  };

  const signOut = async () => {
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut();
      toast.success('Successfully logged out.');
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const direction = TRANSLATIONS[lang]?.dir || 'ltr';
    document.documentElement.setAttribute('dir', direction);
    localStorage.setItem('menu-theme', theme);
    localStorage.setItem('menu-lang', lang);
  }, [theme, lang]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
    setIsCartOpen(true);
    toast.success(`Added ${item.name || 'item'} to cart`);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  return (
    <AppContext.Provider value={{ 
      lang, setLang, 
      theme, toggleTheme, 
      country, setCountry, 
      t, 
      isCartOpen, setIsCartOpen, 
      isProfileDrawerOpen, setIsProfileDrawerOpen,
      cart, addToCart, removeFromCart,
      user, signInWithGoogle, signOut, isLoggingIn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
