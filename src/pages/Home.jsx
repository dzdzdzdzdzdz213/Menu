import React, { useState, useEffect, useRef } from 'react';
import RegionSelector from '../components/RegionSelector';
import FoodCard from '../components/FoodCard';
import QRCodeGenerator from '../components/QRCodeGenerator';
import Leaderboard from '../components/Leaderboard';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, UtensilsCrossed } from 'lucide-react';
import { FoodCardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import './Home.css';

const COUNTRY_THEMES = {
  'Algeria': 'radial-gradient(circle at center, rgba(235, 64, 52, 0.15) 0%, rgba(5, 5, 5, 1) 100%)',
  'Morocco': 'radial-gradient(circle at center, rgba(193, 39, 45, 0.15) 0%, rgba(5, 5, 5, 1) 100%)',
  'Tunisia': 'radial-gradient(circle at center, rgba(224, 33, 36, 0.15) 0%, rgba(5, 5, 5, 1) 100%)',
  'Gulf Countries': 'radial-gradient(circle at center, rgba(181, 166, 66, 0.15) 0%, rgba(5, 5, 5, 1) 100%)',
  'Europe': 'radial-gradient(circle at center, rgba(74, 144, 226, 0.15) 0%, rgba(5, 5, 5, 1) 100%)',
};

const Home = () => {
  const { country, t } = useApp();
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const trendingRef = useRef(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            merchants (
              name
            )
          `)
          .limit(6);

        if (error) throw error;
        
        // Transform the joined data to match the FoodCard prop expectations
        const formattedData = data.map(item => ({
          ...item,
          brand: item.merchants?.name || 'Local Vendor',
          imageUrl: item.image_url // map DB column to prop name
        }));

        setFoods(formattedData);
      } catch (err) {
        console.error('Error fetching foods:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

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
          </div>
        ) : foods.length > 0 ? (
          <div className="bento-grid">
            {foods.map(food => (
              <FoodCard key={food.id} item={food} />
            ))}
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
    </div>
  );
};

export default Home;
