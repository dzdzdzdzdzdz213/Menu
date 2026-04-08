import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { Loader2, Utensils } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from('products').select();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page container">
      {/* Sleek Minimal Header */}
      <section className="menu-header">
        <h2 className="discovery-title" style={{ fontSize: '3rem', marginTop: '2rem' }}>
          Explore our <br/><span className="gradient-text">Menu</span>
        </h2>
      </section>

      {/* Menu Grid */}
      <section className="menu-section slide-in" style={{ paddingBottom: '4rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 className="animate-spin gradient-text" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state glass">
            <Utensils size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3 className="title-md">Menu is Empty</h3>
            <p className="text-muted">The restaurant hasn't added any items yet.</p>
          </div>
        ) : (
          <div className="bento-grid">
            {items.map((item) => (
              <FoodCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
