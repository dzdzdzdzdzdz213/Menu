import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Loader2 } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import './Restaurant.css';

const Restaurant = () => {
  const { id } = useParams();
  const { t } = useApp();
  const [merchant, setMerchant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setIsLoading(true);
      try {
        // Simulating Merchant Profile Fetch
        // In reality, you'd fetch from exact 'profiles' matching the UUID
        // We use locally stored data if they just updated it on their dashboard
        const localSettings = JSON.parse(localStorage.getItem(`merchant_profile_${id}`) || '{}');
        
        let address = localSettings.address || "Rue Didouche Mourad, Algiers";
        let heroImage = localSettings.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop";
        let restaurantName = localSettings.name || "Gourmet Experience";
        
        // Fetch products specifically for this merchant using their 'id'
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('merchant_id', id);

        const realProducts = data && data.length > 0 ? data.map(item => ({
          ...item,
          brand: restaurantName,
          imageUrl: item.image_url
        })) : [];

        setMerchant({
          name: restaurantName,
          address: address,
          rating: 4.8,
          reviews: 124,
          heroImage: heroImage
        });
        
        // Fallback local inventory if DB hasn't persisted properly due to mock client
        const localInventory = JSON.parse(localStorage.getItem(`merchant_inventory_${id}`) || '[]');
        if (localInventory.length > 0 && realProducts.length === 0) {
           setFoods(localInventory.map(i => ({...i, brand: restaurantName, imageUrl: i.image_url})));
        } else {
           setFoods(realProducts);
        }

      } catch (err) {
        console.error('Error fetching restaurant data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10rem', minHeight: '100vh' }}><Loader2 className="animate-spin text-red" size={48} /></div>;
  }

  return (
    <div className="restaurant-page">
      <section className="restaurant-hero">
        <img src={merchant.heroImage} alt={merchant.name} className="restaurant-hero-img" />
        <div className="restaurant-hero-overlay">
          <div className="restaurant-info container">
            <h1>{merchant.name}</h1>
            <div className="restaurant-stats">
              <span className="restaurant-stat text-muted">
                <MapPin size={18} className="text-red" /> {merchant.address}
              </span>
              <span className="restaurant-stat text-muted">
                <Star size={18} className="text-red" style={{ fill: 'var(--color-red)' }} /> {merchant.rating} ({merchant.reviews}+ ratings)
              </span>
              <span className="restaurant-stat text-muted">
                <Clock size={18} className="text-red" /> 30-45 min
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>
        
        {/* Menu Section */}
        <main className="restaurant-menu">
          <h2 className="title-md" style={{ marginBottom: '2rem' }}>Our Menu</h2>
          {foods.length > 0 ? (
            <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {foods.map((food, idx) => (
                <FoodCard key={food.id || idx} item={food} />
              ))}
            </div>
          ) : (
             <div className="empty-state text-center glass" style={{ padding: '4rem', borderRadius: '16px' }}>
                <p className="text-muted">This restaurant hasn't verified their menu items yet.</p>
             </div>
          )}
        </main>

        {/* Info Sidebar (Google Maps) */}
        <aside className="restaurant-sidebar">
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
             <h3 className="title-sm" style={{ marginBottom: '1rem' }}>Location Map</h3>
             <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>{merchant.address}</p>
             <div className="map-container">
               {/* REAL GOOGLE MAPS IFRAME INTEGRATION */}
               <iframe 
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(merchant.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Google Maps API"
               ></iframe>
             </div>
             
             <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
               <h4 className="title-sm" style={{ marginBottom: '1rem' }}>About Vendor</h4>
               <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                  A certified premium local merchant on Menu, delivering exactly what you crave with high standards of quality.
               </p>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Restaurant;
