import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './FoodCard.css';

const FoodCard = ({ product }) => {
  const { addToCart } = useApp();
  const { addToast } = useToast();

  const handleAdd = () => {
    addToCart(product);
    addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="discovery-card glass">
      <div className="card-image-wrapper">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </div>
      
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 className="item-name" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            {product.name}
          </h3>
          <span className="price-tag gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {product.price} DZD
          </span>
        </div>

        <div className="card-actions" style={{ marginTop: '1.5rem' }}>
          <button 
            className="btn-primary w-100 chromatic-shift" 
            onClick={handleAdd}
            style={{ padding: '0.75rem', borderRadius: '12px' }}
          >
            <ShoppingBag size={18} style={{ marginRight: 8 }} />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
