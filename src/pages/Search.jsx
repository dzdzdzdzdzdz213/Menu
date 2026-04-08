import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, Loader2, Map as MapIcon, List, MapPin, SearchX } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import './Home.css';

const CATEGORIES = ['All', 'Restaurants', 'Hotels', 'Experiences', 'Attractions', 'Traditional Sweets', 'Japanese', 'Chinese', 'Traditional Restaurants'];

const Search = () => {
  const { t, country } = useApp();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.includes(initialCategory) ? initialCategory : 'All');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // Mocking the result set dynamically based on category for the Omni-Search demo
        // In a real app we would query different tables or filter by broader `entity_type`.
        let supabaseQuery = supabase
          .from('products')
          .select(`*, merchants ( name )`);
        
        // We will just fetch random ones and format them to look like the different types
        const { data, error } = await supabaseQuery.limit(12);

        if (error) throw error;

        // Mock Transformation
        const formattedResults = data.map((item, index) => {
          let entityType = activeCategory !== 'All' ? activeCategory : CATEGORIES[(index % 4) + 1];
          return {
            ...item,
            brand: item.merchants?.name || `Premium ${entityType.slice(0, -1)}`,
            name: `${entityType.slice(0, -1)} at ${item.merchants?.name || 'Local'}`,
            imageUrl: item.image_url,
            category: entityType,
            rating: item.rating || (4 + Math.random()).toFixed(1)
          };
        }).filter(item => {
          if (query && !item.name.toLowerCase().includes(query.toLowerCase()) && !item.brand.toLowerCase().includes(query.toLowerCase())) return false;
          if (activeCategory !== 'All' && item.category !== activeCategory) return false;
          return true;
        });

        setResults(formattedResults);
      } catch (err) {
        console.error('Search error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  useSEO({
    title: 'Omni-Search',
    description: 'Find places, hotels, experiences and delicacies with our omni search.',
    url: '/search'
  });

  return (
    <div className="search-page container page-transition" style={{ paddingTop: '3rem' }}>
      <section className="search-hero glass" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="title-lg" style={{ marginBottom: '1.5rem' }}>Omni-Search <span className="text-red">Discovery</span></h2>
        <div className="search-bar-wrapper" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for places, hotels, or experiences..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1.25rem 1.5rem 1.25rem 3.5rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text)',
              fontSize: '1.1rem'
            }}
          />
          <SearchIcon className="text-muted" size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </section>

      <section className="trending-section">
        <div className="search-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="category-filters" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-chip glass ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: activeCategory === cat ? 'var(--color-red)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? 'white' : 'var(--color-text-muted)',
                  transition: 'all 0.2s',
                  border: activeCategory === cat ? '1px solid var(--color-red)' : '1px solid var(--glass-border)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="view-toggle glass" style={{ display: 'flex', padding: '0.25rem', borderRadius: '12px' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: viewMode === 'list' ? 'var(--glass-border)' : 'transparent' }}
            >
              <List size={18} /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: viewMode === 'map' ? 'var(--glass-border)' : 'transparent' }}
            >
              <MapIcon size={18} /> Map
            </button>
          </div>
        </div>

        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isLoading ? <Loader2 className="animate-spin text-red" size={24} /> : <MapPin className="text-red" size={24} />}
            <h3 className="title-md">{query ? `Results for "${query}" in ${country}` : `Top Rated around ${country}`}</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.9rem' }}
            >
              <option value="default">Relevance</option>
              <option value="desc">Highest Rated</option>
              <option value="asc">Lowest Rated</option>
            </select>
          </div>
        </div>
        
        {(() => {
          let displayedResults = [...results];
          if (sortOrder === 'desc') {
            displayedResults.sort((a, b) => b.rating - a.rating);
          } else if (sortOrder === 'asc') {
            displayedResults.sort((a, b) => a.rating - b.rating);
          }
          
          if (viewMode === 'list') {
            return isLoading ? (
              <div className="bento-grid">
                 {[1, 2, 3, 4, 5, 6].map(i => <FoodCardSkeleton key={i} />)}
              </div>
            ) : displayedResults.length > 0 ? (
              <div className="bento-grid">
                {displayedResults.map(item => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
               <EmptyState 
                  icon={SearchX} 
                  title="No places found" 
                  message={query ? `No places found matching "${query}"` : "Try adjusting your category or search term."} 
               />
            );
          } else {
            return (
              <div className="map-view glass" style={{ height: '600px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(country)}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Interactive Discovery Map"
                ></iframe>
                {displayedResults.length > 0 && (
                  <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '800px', display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '16px' }}>
                     {displayedResults.slice(0, 3).map(item => (
                       <div key={item.id} style={{ minWidth: '250px', background: 'var(--color-surface)', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                         <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '100%', objectFit: 'cover' }} />
                         <div style={{ padding: '0.75rem' }}>
                           <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</p>
                           <p className="text-muted" style={{ fontSize: '0.8rem' }}>⭐ {item.rating} • {item.brand}</p>
                         </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            );
          }
        })()}
      </section>

      <div className="mobile-nav-spacer"></div>
    </div>
  );
};

export default Search;
