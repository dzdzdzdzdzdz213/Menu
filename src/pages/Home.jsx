import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { useApp } from '../hooks/useApp';
import toast from 'react-hot-toast';
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

const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useApp();
  const [items, setItems] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [clickCounts, setClickCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Sellers (profiles with role='seller')
        const { data: mData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'seller')
          .eq('is_active', true);
        
        setMerchants(mData || []);

        // 2. Fetch Products
        const { data: pData } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active');
        
        setItems(pData?.map(p => ({
          ...p,
          rating: 4.5,
          imageUrl: p.image_url
        })) || []);

        // 3. Fetch Click Analytics
        const { data: aData } = await supabase
          .from('analytics')
          .select('product_id')
          .eq('event_type', 'whatsapp_click');
        
        const counts = (aData || []).reduce((acc, curr) => {
          if (curr.product_id) {
            acc[curr.product_id] = (acc[curr.product_id] || 0) + 1;
          }
          return acc;
        }, {});
        
        setClickCounts(counts);

      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const hotItems = [...items]
    .sort((a, b) => {
      const countA = clickCounts[a.id] || 0;
      const countB = clickCounts[b.id] || 0;
      if (countB !== countA) return countB - countA;
      // Fallback to newest
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 3);

  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const handleAddHot = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to order!`);
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
            Algerian Multi-Vendor Platform
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
              View Menu
            </button>
          </div>

          <div className="hero-stats slide-in">
            <div className="hero-stat">
              <span className="hero-stat-val">{items.length}+</span>
              <span className="hero-stat-label">Dishes</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">{merchants.length}+</span>
              <span className="hero-stat-label">Vendors</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">4.8★</span>
              <span className="hero-stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section className="container" id="food-menu" style={{ marginTop: '4rem' }}>
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
            <p className="text-muted">Stay tuned! Our sellers are adding new delicacies every hour.</p>
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
        {merchants.length === 0 && !isLoading ? (
          <p className="text-muted">No restaurants available at the moment.</p>
        ) : (
          <div className="merchants-grid">
            {merchants.map(m => (
              <div
                key={m.id}
                className="merchant-showcase-card"
                onClick={() => navigate(`/restaurant/${m.id}`)}
              >
                <div className="merchant-card-img">
                  <img src={m.hero_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"} alt={m.full_name} loading="lazy" />
                  <div className="merchant-card-overlay" />
                </div>
                <div className="merchant-card-body">
                  <div className="merchant-card-info">
                    <h3 className="merchant-card-name" style={{ color: 'white' }}>{m.full_name}</h3>
                    <span className="merchant-card-cat">{m.location || 'Local Kitchen'}</span>
                  </div>
                  <div className="merchant-card-rating">
                    <Star size={14} fill="var(--color-orange)" color="var(--color-orange)" />
                    4.8
                  </div>
                </div>
                <div className="merchant-card-cta">
                  Explore Menu <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
