import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Loader2, Grid as GridIcon, Image as ImageIcon, MessageSquare, Calendar } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import ReviewSystem from '../components/ReviewSystem';
import BookingEngine from '../components/BookingEngine';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import './Restaurant.css';

const Restaurant = () => {
  const { id } = useParams();
  const { t } = useApp();
  const [merchant, setMerchant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Menu');

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setIsLoading(true);
      try {
        const localSettings = JSON.parse(localStorage.getItem(`merchant_profile_${id}`) || '{}');
        
        let address = localSettings.address || "Rue Didouche Mourad, Algiers";
        let heroImage = localSettings.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop";
        let restaurantName = localSettings.name || "Premium Local Spot";
        
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

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Menu':
        return foods.length > 0 ? (
          <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {foods.map((food, idx) => (
              <FoodCard key={food.id || idx} item={food} />
            ))}
          </div>
        ) : (
           <div className="empty-state text-center glass" style={{ padding: '4rem', borderRadius: '16px' }}>
              <p className="text-muted">Digital Menu currently unavailable.</p>
           </div>
        );
      
      case 'Gallery':
        return foods.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {foods.map((food, idx) => (
              <div key={idx} style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '8px' }}>
                <img src={food.imageUrl} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center glass" style={{ padding: '4rem', borderRadius: '16px' }}>
             <p className="text-muted">No photos in the gallery yet.</p>
          </div>
        );

      case 'Reviews':
        return <ReviewSystem initialReviews={[
          {id: 1, user: 'Ahmed K.', rating: 5, text: 'Amazing food and great atmosphere!', date: '2 days ago'},
          {id: 2, user: 'Sarah L.', rating: 4, text: 'Very good service, but a bit crowded.', date: '1 week ago'}
        ]} />;
        
      case 'Reservations':
        return <BookingEngine />;
        
      default:
        return null;
    }
  };

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
                <Star size={18} className="text-red" style={{ fill: 'var(--color-red)' }} /> {merchant.rating} ({merchant.reviews}+ reviews)
              </span>
              <span className="restaurant-stat text-muted">
                <Clock size={18} className="text-red" /> Open Now
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '-2rem', zIndex: 10, position: 'relative' }}>
        
        {/* Instagram Style Tab Navigation */}
        <div className="profile-tabs glass" style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem', borderRadius: '16px', overflowX: 'auto', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('Menu')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: activeTab === 'Menu' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'Menu' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'Menu' ? 'bold' : 'normal', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <GridIcon size={18} /> Menu
          </button>
          <button 
            onClick={() => setActiveTab('Gallery')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: activeTab === 'Gallery' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'Gallery' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'Gallery' ? 'bold' : 'normal', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <ImageIcon size={18} /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab('Reviews')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: activeTab === 'Reviews' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'Reviews' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'Reviews' ? 'bold' : 'normal', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={18} /> Reviews
          </button>
          <button 
            onClick={() => setActiveTab('Reservations')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: activeTab === 'Reservations' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'Reservations' ? 'white' : 'var(--color-text-muted)', fontWeight: activeTab === 'Reservations' ? 'bold' : 'normal', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            <Calendar size={18} /> Reserve
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }} className="restaurant-main-grid">
          
          <main className="restaurant-content">
            {renderTabContent()}
          </main>

          <aside className="restaurant-sidebar">
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
               <h3 className="title-sm" style={{ marginBottom: '1rem' }}>Location Map</h3>
               <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>{merchant.address}</p>
               <div className="map-container">
                 <iframe 
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(merchant.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Google Maps API"
                 ></iframe>
               </div>
               
               <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                 <h4 className="title-sm" style={{ marginBottom: '1rem' }}>About Place</h4>
                 <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    A certified premium place on the platform, highly rated by the community for excellent service and unforgettable experiences.
                 </p>
               </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Restaurant;
