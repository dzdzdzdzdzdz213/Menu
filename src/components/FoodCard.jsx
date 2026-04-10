import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { useToast } from '../hooks/useToast';
import './FoodCard.css';

const FoodCard = ({ product, item }) => {
  const { addToCart } = useApp();
  const { addToast } = useToast();

  const data = product || item; 

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation if the card is ever wrapped in a link
    if (!data) return;
    addToCart(data);
    addToast(`${data.name} added to order!`, 'success');
  };

  if (!data) return null;

  return (
    <div className="food-card">
      <div className="food-image-wrapper">
        <img src={data.image_url || data.imageUrl} alt={data.name} className="food-image" loading="lazy" />
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
