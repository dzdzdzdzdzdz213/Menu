import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, t, user } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to proceed to checkout.");
      // Optional: push to /account by handling navigation or window location
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate API call for secure checkout session
    setTimeout(() => {
      setIsCheckingOut(false);
      alert('Checkout process initiated securely. Proceeding to payment...');
      setIsCartOpen(false);
      // Here usually window.location.href = data.checkoutUrl;
    }, 1500);
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer glass" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="title-md">Your Cart <span className="text-red">({cart.length})</span></h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} className="text-muted" />
              <p className="text-muted">Your cart is empty.</p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)}>Start Exploring</button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.cartId} className="cart-item glass">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="text-red">{item.price} DZD</span>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.cartId)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer glass">
            <div className="total-row">
              <span>Total</span>
              <span className="total-price">{total} DZD</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
