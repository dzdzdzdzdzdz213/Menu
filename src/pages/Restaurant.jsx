import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Loader2, Grid as GridIcon, Image as ImageIcon, MessageSquare, Calendar, Store, ImageOff } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton, RestaurantHeaderSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import ReviewSystem from '../components/ReviewSystem';
import BookingEngine from '../components/BookingEngine';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import './Restaurant.css';

const Restaurant = () => {
  const { id } = useParams();
  const { t } = useApp();
  const [merchant, setMerchant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Menu');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

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

        const realProducts = data && data.length > 0 ? data.map((item, index) => ({
          ...item,
          brand: restaurantName,
          imageUrl: item.image_url,
          rating: item.rating || (4 + Math.random()).toFixed(1), 
          cuisine: item.category || ['Pizza', 'Healthy', 'Traditional', 'Fast Food'][index % 4]
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
           setFoods(localInventory.map((i, idx) => ({
             ...i, 
             brand: restaurantName, 
             imageUrl: i.image_url,
             rating: i.rating || (4 + Math.random()).toFixed(1),
             cuisine: i.category || ['Pizza', 'Healthy', 'Traditional', 'Fast Food'][idx % 4]
           })));
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

  useSEO({
    title: merchant ? merchant.name : 'Restaurant',
    description: merchant ? `Order from ${merchant.name} on Menu.` : 'Restaurant details.',
    image: merchant ? merchant.heroImage : '/favicon.svg',
    url: `/restaurant/${id}`
  });

  if (isLoading) {
    return (
      <div className="restaurant-page page-transition">
        <RestaurantHeaderSkeleton />
        <div className="container" style={{ paddingTop: '3rem' }}>
          <div className="bento-grid">
             {[1, 2, 3, 4].map(i => <FoodCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Menu': {
        const cuisines = ['All', ...new Set(foods.map(f => f.cuisine))];
        let processedFoods = [...foods];
        
        if (cuisineFilter !== 'All') {
          processedFoods = processedFoods.filter(f => f.cuisine === cuisineFilter);
        }
        
        if (sortOrder === 'desc') {
          processedFoods.sort((a, b) => b.rating - a.rating);
        } else if (sortOrder === 'asc') {
          processedFoods.sort((a, b) => a.rating - b.rating);
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {foods.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {cuisines.map(c => (
                    <button 
                      key={c}
                      onClick={() => setCuisineFilter(c)}
                      className={`filter-chip ${cuisineFilter === c ? 'active' : ''}`}
                      style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', border: '1px solid var(--glass-border)', background: cuisineFilter === c ? 'var(--color-red)' : 'transparent', color: cuisineFilter === c ? 'white' : 'var(--color-text-muted)' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={16} className="text-muted" />
                  <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="default">Default Sort</option>
                    <option value="desc">Highest Rated</option>
                    <option value="asc">Lowest Rated</option>
                  </select>
                </div>
              </div>
            )}
            {processedFoods.length > 0 ? (
              <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {processedFoods.map((food, idx) => (
                  <FoodCard key={food.id || idx} item={food} />
                ))}
              </div>
            ) : (
               <EmptyState 
                 icon={Store} 
                 title="No matches" 
                 message="No items match your filter criteria." 
               />
            )}
          </div>
        );
      }
      
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
           <EmptyState 
             icon={ImageOff} 
             title="Gallery Empty" 
             message="No photos in the gallery yet." 
           />
        );

      case 'Reviews':
        return <ReviewSystem entityId={id} type="merchant" initialReviews={[]} />;
        
      case 'Reservations':
        return <BookingEngine />;
        
      default:
        return null;
    }
  };

  return (
    <div className="restaurant-page page-transition">
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
        <div className="profile-tabs glass">
          <button 
            onClick={() => setActiveTab('Menu')}
            className={`tab-btn ${activeTab === 'Menu' ? 'active' : ''}`}
          >
            <GridIcon size={18} /> Menu
          </button>
          <button 
            onClick={() => setActiveTab('Gallery')}
            className={`tab-btn ${activeTab === 'Gallery' ? 'active' : ''}`}
          >
            <ImageIcon size={18} /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab('Reviews')}
            className={`tab-btn ${activeTab === 'Reviews' ? 'active' : ''}`}
          >
            <MessageSquare size={18} /> Reviews
          </button>
          <button 
            onClick={() => setActiveTab('Reservations')}
            className={`tab-btn ${activeTab === 'Reservations' ? 'active' : ''}`}
          >
            <Calendar size={18} /> Reserve
          </button>
        </div>

        <div className="restaurant-main-grid">
          
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
