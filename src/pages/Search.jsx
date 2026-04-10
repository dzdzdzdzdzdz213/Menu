import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, Loader2, Map as MapIcon, List, MapPin, SearchX, ArrowRight, Star, Utensils } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { useApp } from '../hooks/useApp';
import { useSEO } from '../hooks/useSEO';
import './Home.css'; // Reuse home styles for consistency

const DISCOVERY_CATEGORIES = ['All', 'Pizza', 'Traditional', 'Fast Food', 'Desserts', 'Beverages'];

const Search = () => {
  const { cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        let supabaseQuery = supabase
          .from('products')
          .select(`*`);
        
        if (activeCategory !== 'All') {
          supabaseQuery = supabaseQuery.eq('category', activeCategory);
        }

        // 2. Fetch All Products (DB + All Local)
        const { data: dbData } = await supabase.from('products').select('*');
        
        const allLocalProducts = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('merchant_inventory_')) {
            allLocalProducts.push(...JSON.parse(localStorage.getItem(key)));
          }
        }
        
        const combined = [...(dbData || []), ...allLocalProducts];
        
        // Filter by Category and Query
        let filtered = combined.filter(item => {
          const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
          const matchesCat = activeCategory === 'All' || item.category === activeCategory;
          return matchesQuery && matchesCat;
        });

        // Add fallback if absolutely empty
        if (filtered.length === 0 && !query && activeCategory === 'All') {
           filtered = MOCK_ITEMS;
        }

        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 400);

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  useSEO({
    title: 'Discovery - Find Your Taste',
    description: 'Explore our vast menu of premium local food sellers and restaurants.',
    url: '/search'
  });

  return (
    <div className="search-page page-transition" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Search Header */}
      <section className="hero-banner" style={{ minHeight: 'auto', padding: '10rem 0 4rem', background: 'linear-gradient(to bottom, rgba(255,51,51,0.05), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow slide-in">
            <TrendingUp size={14} /> Discovery Hub
          </div>
          <h2 className="hero-title slide-in" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>
            Find your next <span className="gradient-text">delicacy</span>
          </h2>
          
          <div className="search-bar-premium slide-in" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <div style={{ padding: '0 1.5rem', color: 'var(--color-red)' }}><SearchIcon size={24} /></div>
              <input 
                type="text" 
                placeholder="Search by dish name or craving..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.1rem',
                  padding: '1rem 0',
                  outline: 'none'
                }}
              />
              <div className="view-toggle glass" style={{ display: 'flex', padding: '0.25rem', borderRadius: '16px', margin: '0 0.5rem' }}>
                <button 
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? 'black' : 'white', cursor: 'pointer', transition: '0.3s', fontWeight: 600 }}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: viewMode === 'map' ? 'white' : 'transparent', color: viewMode === 'map' ? 'black' : 'white', cursor: 'pointer', transition: '0.3s', fontWeight: 600 }}
                >
                  <MapIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div className="search-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="cats-scroll" style={{ margin: 0 }}>
            {DISCOVERY_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="default" style={{background:'#111'}}>Relevance</option>
              <option value="desc" style={{background:'#111'}}>Top Rated</option>
              <option value="asc" style={{background:'#111'}}>Price: Low to High</option>
            </select>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            <div className="section-header-row">
              <h3 className="section-title" style={{ marginBottom: 0 }}>
                {query ? `Search results for "${query}"` : `${activeCategory} Curations`}
                <span className="section-count"> ({results.length})</span>
              </h3>
            </div>

            {isLoading ? (
              <div className="food-grid">
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
              </div>
            ) : results.length > 0 ? (
              <div className="food-grid">
                {results.map(item => (
                  <FoodCard key={item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <SearchX size={48} className="text-muted" />
                <h3>No delicacies found</h3>
                <p className="text-muted">Try a different category or search term</p>
                <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setQuery(''); setActiveCategory('All'); }}>Clear All Filters</button>
              </div>
            )}
          </>
        ) : (
          <div className="map-discovery-view glass" style={{ height: '650px', borderRadius: '30px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', position: 'relative' }}>
            <iframe 
              src={`https://maps.google.com/maps?q=Algiers,Algeria&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
              title="Interactive Discovery Map"
            ></iframe>
            
            {/* Map Overlay Cards */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem', background: 'rgba(5,5,5,0.4)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
               {results.slice(0, 5).map(item => (
                 <div key={item.id} className="glass" style={{ minWidth: '300px', borderRadius: '16px', overflow: 'hidden', display: 'flex', border: '1px solid var(--glass-border)', cursor: 'pointer' }} onClick={() => navigate(`/restaurant/${item.merchant_id || 'demo'}`)}>
                   <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                   <div style={{ padding: '1rem', flex: 1 }}>
                     <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{item.name}</p>
                     <p className="text-red" style={{ fontWeight: 800, margin: '0.25rem 0', fontSize: '1rem' }}>{item.price} DZD</p>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                       <Star size={12} fill="var(--color-orange)" color="var(--color-orange)" /> {item.rating} • {item.category}
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </section>

      <div className="mobile-nav-spacer"></div>
    </div>
  );
};

export default Search;
