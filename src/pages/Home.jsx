import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { useApp } from '../hooks/useApp';
import { useToast } from '../hooks/useToast';
import { Loader2, Utensils, Flame, ChevronRight, Store, Shield, User, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import './Home.css';

const CATEGORIES = ['All', 'Pizza', 'Fast Food', 'Traditional', 'Desserts'];

const CATEGORY_ICONS = {
  'All': '🍽️',
  'Pizza': '🍕',
  'Fast Food': '🍔',
  'Traditional': '🫕',
  'Desserts': '🍰',
};

const MOCK_ITEMS = [
  { id: '101', name: 'Artisan Burrata Pizza', price: 1450, category: 'Pizza', rating: '5.0', specs: 'Hand-pulled burrata, cherry tomatoes from Tipaza, and organic basil.', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=600&auto=format&fit=crop' },
  { id: '102', name: 'Imperial Couscous', price: 2100, category: 'Traditional', rating: '4.9', specs: 'Seven-vegetable clay-pot couscous with tender slow-roasted lamb shank.', image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=600&auto=format&fit=crop' },
  { id: '103', name: 'Black Angus Smash', price: 1200, category: 'Fast Food', rating: '4.8', specs: 'Double Black Angus patties, aged cheddar, and truffle-aioli on brioche.', image_url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=600&auto=format&fit=crop' },
  { id: '104', name: 'Pistachio Baklava Tower', price: 850, category: 'Desserts', rating: '5.0', specs: 'Layers of paper-thin pastry with premium Turkish pistachios and honey.', image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=600&auto=format&fit=crop' },
  { id: '105', name: 'Spiced Merguez Wrap', price: 950, category: 'Fast Food', rating: '4.7', specs: 'Grilled artisan merguez, harissa-yogurt, and pickled red onions.', image_url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=600&auto=format&fit=crop' },
  { id: '106', name: 'Truffle Mushroom Pie', price: 1600, category: 'Pizza', rating: '4.8', specs: 'Wild mushrooms, black truffle oil, and fior di latte on sourdough.', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop' },
];

const MOCK_MERCHANTS = [
  { id: '1', name: 'Villa Didouche', category: 'Traditional', rating: '5.0', heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Nomad Burgers', category: 'Fast Food', rating: '4.9', heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Sidi Yahia Pizza Co.', category: 'Pizza', rating: '4.8', heroImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'L’Artisan Pâtissier', category: 'Desserts', rating: '5.0', heroImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop' },
];

const PORTALS = [
  {
    icon: User,
    label: 'Customer',
    sublabel: 'Order delicious meals',
    path: '/account',
    color: '#ffffff',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.15)',
  },
  {
    icon: Store,
    label: 'Merchant',
    sublabel: 'Manage your menu',
    path: '/merchants',
    color: '#ff9100',
    bg: 'rgba(255,145,0,0.08)',
    border: 'rgba(255,145,0,0.3)',
  },
  {
    icon: Shield,
    label: 'Admin',
    sublabel: 'Control the platform',
    path: '/admin',
    color: '#ff3333',
    bg: 'rgba(255,51,51,0.08)',
    border: 'rgba(255,51,51,0.3)',
  },
];

const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useApp();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Merchants (DB + Local)
        const { data: mData } = await supabase.from('restaurants').select('*');
        const globalMap = JSON.parse(localStorage.getItem('global_merchants_data') || '{}');
        const localMerchants = Object.values(globalMap).map(m => ({
          ...m,
          id: m.id || 'demo-' + Math.random(),
          hero_image: m.heroImage
        }));
        
        const combinedMerchants = [...(mData || []), ...localMerchants];
        setMerchants(combinedMerchants.length > 0 ? combinedMerchants : MOCK_MERCHANTS);

        // 2. Fetch Products (DB + All Local)
        const { data: pData } = await supabase.from('products').select('*');
        
        const allLocalProducts = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('merchant_inventory_')) {
            allLocalProducts.push(...JSON.parse(localStorage.getItem(key)));
          }
        }
        
        const combinedProducts = [...(pData || []), ...allLocalProducts];
        setItems(combinedProducts.length > 0 ? combinedProducts : MOCK_ITEMS);

      } catch (err) {
        setMerchants(MOCK_MERCHANTS);
        setItems(MOCK_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const hotItems = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const handleAddHot = (item) => {
    addToCart(item);
    addToast(`${item.name} added to order!`, 'success');
  };

  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────── */}
      <section className="hero-banner">
        <div className="hero-bg-blur hero-blob-1" />
        <div className="hero-bg-blur hero-blob-2" />
        <div className="container hero-inner">
          <div className="hero-badge slide-in">
            <Flame size={14} color="var(--color-red)" />
            Premium Multi-Vendor Aggregator
          </div>
          <h1 className="hero-title slide-in">
            Mediterranean Soul, <br />
            <span className="gradient-text">Luminous Gastronomy.</span>
          </h1>
          <p className="hero-subtitle slide-in">
            Discover a curated collection of the finest regional delicacies, delivered with precision to your doorstep.
          </p>
          <div className="hero-actions slide-in">
            <button className="btn-primary hero-cta" onClick={() => navigate('/search')}>
              Start Discovery <ArrowRight size={18} />
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('food-menu').scrollIntoView({ behavior: 'smooth' })}>
              View Regular Menu
            </button>
          </div>

          <div className="hero-stats slide-in">
            <div className="hero-stat">
              <span className="hero-stat-val">500+</span>
              <span className="hero-stat-label">Dishes</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">100+</span>
              <span className="hero-stat-label">Vendors</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">4.9★</span>
              <span className="hero-stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAL SELECTOR ─────────────────────────── */}
      <section className="container portal-section">
        <div className="section-eyebrow">
          <Shield size={14} color="var(--color-red)" /> Unified Boards
        </div>
        <h2 className="section-title">Direct Portal <span className="gradient-text">Access</span></h2>
        <div className="portals-grid">
          {PORTALS.map(p => (
            <div
              key={p.path}
              className="portal-card"
              style={{ '--portal-color': p.color, '--portal-bg': p.bg, '--portal-border': p.border }}
              onClick={() => navigate(p.path)}
              role="button"
              tabIndex={0}
            >
              <div className="portal-icon-wrap">
                <p.icon size={28} color={p.color} />
              </div>
              <div className="portal-info">
                <span className="portal-label">{p.label} Board</span>
                <span className="portal-sublabel">{p.sublabel}</span>
              </div>
              <div className="portal-btn-mock">
                Launch <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section className="container" id="food-menu">
        <div className="section-eyebrow">
          <Utensils size={14} color="var(--color-red)" /> Cuisine Types
        </div>
        <div className="cats-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="cat-emoji">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── HOT LIST ─────────────────────────── */}
      {hotItems.length > 0 && (
        <section className="container hot-strip">
          <div className="hot-strip-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="hot-fire-icon">🔥</div>
              <div>
                <div className="hot-title">The Hot List</div>
                <div className="hot-sub text-muted">Trending restaurants & dishes</div>
              </div>
            </div>
          </div>
          <div className="hot-items-row">
            {hotItems.map(item => (
              <div key={`hot-${item.id}`} className="hot-item-card">
                <div className="hot-item-img-wrap">
                  <img src={item.image_url} alt={item.name} className="hot-item-img" loading="lazy" />
                  <div className="hot-item-badge">HOT DEAL</div>
                </div>
                <div className="hot-item-info">
                  <span className="hot-item-name">{item.name}</span>
                  <div className="hot-item-footer">
                    <span className="hot-item-price">{item.price} DZD</span>
                    <button className="hot-add-btn" onClick={() => handleAddHot(item)}>
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FOOD GRID ─────────────────────────── */}
      <section className="container food-grid-section">
        <div className="section-header-row">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            {activeCategory} <span className="gradient-text">Selection</span>
            <span className="section-count"> ({filteredItems.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state-box">
            <Utensils size={40} className="text-muted" />
            <h3>No items available</h3>
            <p className="text-muted">Explore another category or search for something specific.</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredItems.map(item => (
              <FoodCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* ── MERCHANTS ─────────────────────────── */}
      <section className="container merchants-showcase" id="merchants-section">
        <div className="section-eyebrow">
          <Store size={14} color="var(--color-red)" /> Food Sellers
        </div>
        <h2 className="section-title">Verified <span className="gradient-text">Restaurants</span></h2>
        <div className="merchants-grid">
          {merchants.map(m => (
            <div
              key={m.id}
              className="merchant-showcase-card"
              onClick={() => navigate(`/restaurant/${m.id}`)}
            >
              <div className="merchant-card-img">
                <img src={m.heroImage || m.hero_image} alt={m.name} loading="lazy" />
                <div className="merchant-card-overlay" />
              </div>
              <div className="merchant-card-body">
                <div className="merchant-card-info">
                  <h3 className="merchant-card-name">{m.name || m.full_name}</h3>
                  <span className="merchant-card-cat">{m.category || 'Restaurant'}</span>
                </div>
                <div className="merchant-card-rating">
                  <Star size={14} fill="var(--color-orange)" color="var(--color-orange)" />
                  4.8
                </div>
              </div>
              <div className="merchant-card-cta">
                View Menu <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
