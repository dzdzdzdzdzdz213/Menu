import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import toast from 'react-hot-toast';
import './FoodCard.css';

const FoodCard = ({ product, item }) => {
  const { addToCart } = useApp();

  const data = product || item; 

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation if the card is ever wrapped in a link
    if (!data) return;
    addToCart(data);
    toast.success(`${data.name} added to cart`);
  };

  if (!data) return null;

  const imgSrc = data.image_url || data.imageUrl;

  return (
    <div className="food-card">
      <div className="food-image-wrapper">
        {imgSrc ? (
          <img src={imgSrc} alt={data.name} className="food-image" loading="lazy" onError={e => { e.target.style.display='none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display='flex'); }} />
        ) : null}
        <div className="food-image food-image-placeholder" style={{ display: imgSrc ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🍽️</span>
          <span className="text-muted" style={{ fontSize: '0.72rem' }}>No photo</span>
        </div>
        <div className="card-hud">
          <div className="hud-item">
            <Star color="var(--color-orange)" size={12} fill="var(--color-orange)" /> 
            {data.rating || '4.9'}
          </div>
        </div>
      </div>
      
      <div className="food-content">
        <div className="food-brand">{data.category || 'Premium Selection'}</div>
        
        <div className="food-header">
          <h3 className="food-title">
            {data.name}
          </h3>
          <span className="food-price">
            {data.price} DZD
          </span>
        </div>
        
        {data.specs && (
          <p className="item-description">{data.specs}</p>
        )}

        <div className="cta-grid">
          <button 
            className="order-btn" 
            onClick={handleAdd}
          >
            <ShoppingBag size={16} />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
