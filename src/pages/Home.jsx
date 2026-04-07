import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import { supabase } from '../lib/supabase';
<<<<<<< HEAD
import { ArrowRight, Loader2, UtensilsCrossed } from 'lucide-react';
import { FoodCardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
=======
import { Loader2, Utensils } from 'lucide-react';
>>>>>>> b3dd1fa (multiple)
import './Home.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.from('products').select();
        setFoods(data || []);
      } catch (err) {
        console.error('Error fetching foods:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, []);

<<<<<<< HEAD
  useSEO({
    title: 'Top rated foods in ' + country,
    description: 'Discover the absolute best local chefs and top-tier delicacies near you in ' + country + '.',
    url: '/'
  });

  const scrollToTrending = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page container page-transition">



      {/* Trending Food Cards */}
      <section className="main-content">
        <div className="section-header">
          <div ref={trendingRef}>
            <h3 className="title-md">{t.trending}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{t.trendingSubtitle}</p>
          </div>
          <NavLink to="/search" className="btn-outline">View All</NavLink>
        </div>

        {isLoading ? (
          <div className="bento-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FoodCardSkeleton key={i} />
            ))}
=======
  return (
    <div className="home-page container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      
      <section className="section-hud glass slide-in">
        <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div>
            <span className="hud-label" style={{ justifyContent: 'center' }}>
              <Utensils size={14} style={{ marginRight: 8 }} /> Our Menu
            </span>
            <h3 className="title-md" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Delicious <span className="text-red">Choices</span></h3>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem' }}>
            <Loader2 className="animate-spin text-red" size={32} />
>>>>>>> b3dd1fa (multiple)
          </div>
        ) : (
          <div className="bento-grid">
            {foods.map(food => (
              <FoodCard key={food.id} item={food} />
            ))}
<<<<<<< HEAD
          </div>
        ) : (
          <EmptyState 
            icon={UtensilsCrossed} 
            title="No delicacies found" 
            message="Once your Supabase seed is run, delicacies will appear here." 
          />
        )}
      </section>

      <section className="interactive-map-section glass" style={{ marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <h3 className="title-md" style={{ marginBottom: '0.5rem' }}>Discover Places Around {country}</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Find the best restaurants, cafes, and experiences directly on the map.</p>
        </div>
        <div style={{ padding: '0 2rem 2rem 2rem', height: '400px' }}>
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(country)}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Home Interactive Map"
          ></iframe>
        </div>
      </section>

      {/* Top 100 Leaderboard */}
      <Leaderboard />

      {/* Merchant Spotlight & QR Ecosystem */}
      <section className="spotlight-section glass">
        <div className="spotlight-content">
          <h3 className="title-md">Scan. Order. <span className="text-red">Enjoy.</span></h3>
          <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.7 }}>
            Every restaurant on Menu generates a unique QR code. Scan at the table or share the link — your digital menu is always a tap away.
          </p>
          <div className="merchant-stats">
            <div className="stat">
              <span className="stat-value text-red">500+</span>
              <span className="stat-label">Active Vendors</span>
            </div>
            <div className="stat">
              <span className="stat-value">12k+</span>
              <span className="stat-label">Daily Orders</span>
            </div>
            <div className="stat">
              <span className="stat-value">5 <span className="text-red" style={{ fontSize: '1.5rem' }}>★</span></span>
              <span className="stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>

        <div className="qr-demonstration">
          <QRCodeGenerator
            tableId="01"
            restaurantName="Your Restaurant"
            vendorUrl="https://menu.app/v/your-restaurant/01"
          />
        </div>
      </section>

      {/* Spacer for mobile nav */}
      <div className="mobile-nav-spacer"></div>
=======
            {foods.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No items available on the menu yet. Check back soon!
              </div>
            )}
          </div>
        )}
      </section>

      <div className="mobile-nav-spacer" />
>>>>>>> b3dd1fa (multiple)
    </div>
  );
};

export default Home;
