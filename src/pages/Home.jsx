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

      {/* Location Section */}
      <section className="location-section slide-in" style={{ paddingBottom: '8rem' }}>
        <div className="section-header">
          <h2 className="title-md">Find <span className="gradient-text">Us</span></h2>
          <p className="text-muted">Visit our restaurant and enjoy the best culinary experience.</p>
        </div>
        
        <div className="map-container glass">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m3!1d102375.98971448208!2d2.9691461466085564!3d36.702081491757365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128faf30a6c0f3c5%3A0x6b2e7745ef3f6e81!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1712496000000!5m2!1sen!2sdz" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '24px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          <div className="location-info">
            <div className="info-card glass">
              <h4>Address</h4>
              <p>123 Gourmet Street, Algiers, Algeria</p>
            </div>
            <div className="info-card glass">
              <h4>Hours</h4>
              <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
