import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { Loader2, Utensils, Users } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const { data } = await supabase.from('profiles').select().eq('role', 'merchant');
      if (!data || data.length === 0) {
        setMerchants([
           { id: '1', full_name: 'Premium Local Spot' },
           { id: '2', full_name: 'Tokyo Bites' },
           { id: '3', full_name: 'La Trattoria' }
        ]);
      } else {
        setMerchants(data);
      }
    } catch(err) {
      console.error(err);
    }
  };

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

      {/* Top Rated Restaurants */}
      <section className="merchants-section slide-in" style={{ paddingBottom: '4rem' }}>
        <div className="section-header">
          <h2 className="title-md">Top Rated <span className="gradient-text">Restaurants</span></h2>
          <p className="text-muted">Browse all available businesses in our platform.</p>
        </div>
        <div className="merchants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {merchants.map(m => (
            <div key={m.id} className="merchant-card glass" onClick={() => navigate(`/restaurant/${m.id}`)} style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s' }}>
              <div className="merchant-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-red), #ff7b7b)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                 <Users size={32} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{m.full_name || 'Partner Restaurant'}</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>View Menu & Order</p>
            </div>
          ))}
        </div>
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
