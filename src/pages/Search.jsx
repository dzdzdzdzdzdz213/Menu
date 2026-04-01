import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, TrendingUp, Loader2 } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import './Home.css';

const CATEGORIES = ['All', 'Pizza', 'Sweets', 'Traditional', 'Healthy', 'Burgers'];

const Search = () => {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        let supabaseQuery = supabase
          .from('products')
          .select(`
            *,
            merchants ( name )
          `);

        if (query) {
          supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
        }

        if (activeCategory !== 'All') {
          supabaseQuery = supabaseQuery.eq('category', activeCategory);
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;

        const formattedResults = data.map(item => ({
          ...item,
          brand: item.merchants?.name || 'Local Vendor',
          imageUrl: item.image_url
        }));

        setResults(formattedResults);
      } catch (err) {
        console.error('Search error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  return (
    <div className="search-page container" style={{ paddingTop: '3rem' }}>
      <section className="search-hero glass" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="title-lg" style={{ marginBottom: '1.5rem' }}>Find Your <span className="text-red">Cravings</span></h2>
        <div className="search-bar-wrapper" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for restaurants, dishes, or cuisines..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1.25rem 1.5rem 1.25rem 3.5rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '1.1rem'
            }}
          />
          <SearchIcon className="text-muted" size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </section>

      <section className="trending-section">
        <div className="category-filters" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              {t[cat.toLowerCase()] || cat}
            </button>
          ))}
        </div>

        <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          {isLoading ? <Loader2 className="animate-spin text-red" size={24} /> : <TrendingUp className="text-red" size={24} />}
          <h3 className="title-md">{query ? `Results for "${query}"` : 'Trending Delicacies'}</h3>
        </div>
        
        {results.length > 0 ? (
          <div className="bento-grid">
            {results.map(food => (
              <FoodCard key={food.id} item={food} />
            ))}
          </div>
        ) : !isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-muted">No delicacies found matching "{query}"</p>
          </div>
        ) : null}
      </section>

      <div className="mobile-nav-spacer"></div>
    </div>
  );
};

export default Search;
