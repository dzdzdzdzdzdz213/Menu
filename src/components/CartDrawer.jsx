import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { useToast } from '../hooks/useToast';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-drawer glass slide-in-right">
        <div className="cart-header">
          <h3>Your Order</h3>
          <button className="icon-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart text-muted">
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item) => {
              const imgSrc = item.image_url || item.imageUrl;
              return (
                <div key={item.cartId} className="cart-item">
                  {imgSrc ? (
                    <img src={imgSrc} alt={item.name} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', fontSize: '1.5rem' }}>
                      🍽️
                    </div>
                  )}
                  <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="price">{item.price} DZD</span>
                </div>
                <button className="btn-icon text-red" onClick={() => removeFromCart(item.cartId)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer glass">
            <div className="cart-total">
              <span>Total</span>
              <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{cartTotal} DZD</span>
            </div>
            
            {!checkoutDone ? (
              <button 
                className="btn-primary w-100 chromatic-shift" 
                onClick={handleCheckoutClick}
              >
                Begin Checkout <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <CheckCircle size={24} style={{ marginBottom: 4 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>Sent to WhatsApp!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
