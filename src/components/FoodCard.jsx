import { Heart, Camera, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './FoodCard.css';

const FoodCard = ({ item }) => {
  const { addToCart } = useApp();
  const { name, brand, price, ingredients, specs, imageUrl, rating } = item;

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="food-card glass">
      <div className="food-image-wrapper">
        <img src={imageUrl} alt={name} className="food-image" />
        <button className="like-btn glass"><Heart size={18} /></button>
        <div className="rating-badge glass">⭐ {rating}</div>
      </div>
      
      <div className="food-content">
        <div className="food-header">
          <h3 className="food-title">{name}</h3>
          <span className="food-price text-red">{price} DZD</span>
        </div>
        
        <div className="food-brand text-muted">by {brand}</div>
        
        <p className="food-ingredients">
          {ingredients.join(', ')}
        </p>
        
        <div className="food-specs">
          <Info size={14} className="text-red" />
          <span>{specs}</span>
        </div>
        
        <div className="food-actions">
          <button 
            className="btn-primary flex-btn" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <a href="#" className="btn-outline flex-btn insta-btn">
            <Camera size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
