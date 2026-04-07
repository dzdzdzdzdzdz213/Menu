<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Heart, Camera, Info, Star, X } from 'lucide-react';
=======
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
>>>>>>> b3dd1fa (multiple)
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import ReviewSystem from './ReviewSystem';
import './FoodCard.css';

const FoodCard = ({ item }) => {
  const { addToCart } = useApp();
<<<<<<< HEAD
  const { name, brand, price, ingredients, specs, imageUrl, rating } = item;
  const [realRating, setRealRating] = useState(rating || '5.0');
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!item.id) return;
    const fetchAvg = async () => {
      try {
        const { data } = await supabase.from('product_reviews').select('rating').eq('product_id', item.id);
        if (data && data.length > 0) {
          const avg = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
          setRealRating(avg.toFixed(1));
        }
      } catch (err) {}
    };
    fetchAvg();
  }, [item.id]);
=======
  const [isHovered, setIsHovered] = useState(false);
>>>>>>> b3dd1fa (multiple)

  const handleOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
  };

  return (
<<<<<<< HEAD
    <>
    <div className="food-card glass">
      <div className="food-image-wrapper">
        <img src={imageUrl} alt={name} className="food-image" />
        <button className="like-btn glass"><Heart size={18} /></button>
        <div 
          className="rating-badge glass" 
          onClick={() => setShowReviews(true)}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          title="View Reviews"
        >
          ⭐ {realRating}
        </div>
=======
    <div 
      className="food-card slide-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container */}
      <div className="food-image-wrapper">
        <img 
          src={item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'} 
          alt={item.name} 
          className="food-image"
          loading="lazy"
        />
>>>>>>> b3dd1fa (multiple)
      </div>

      {/* Info */}
      <div className="food-content">
        <div className="food-header" style={{ marginBottom: '1rem' }}>
          <h4 className="food-title">{item.name}</h4>
          <span className="food-price">
             {item.price} DZD
          </span>
        </div>
        
        <div className="cta-grid" style={{ gridTemplateColumns: '1fr' }}>
          <button className="order-btn" onClick={handleOrder}>
            <ShoppingBag size={16} style={{ marginRight: 8 }} />
            Add to Order
          </button>
<<<<<<< HEAD
          <button 
            className="btn-outline flex-btn"
            onClick={() => setShowReviews(true)}
            title="Read Reviews"
          >
            <MessageSquare size={18} />
          </button>
=======
>>>>>>> b3dd1fa (multiple)
        </div>
      </div>
    </div>
    
    {showReviews && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowReviews(false)}>
         <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReviews(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-text-muted)' }}>
              <X size={24} />
            </button>
            <div style={{ padding: '2rem 2rem 0' }}>
               <h3 className="title-md">Reviews for {name}</h3>
               <p className="text-muted">by {brand}</p>
            </div>
            <div style={{ padding: '0 1rem 1rem' }}>
              <ReviewSystem entityId={item.id} type="product" initialReviews={[]} />
            </div>
         </div>
      </div>
    )}
    </>
  );
};

export default FoodCard;
