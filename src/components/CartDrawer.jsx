import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, addToCart, t, user } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const groupedCartInfo = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { item, quantity: 1, cartIds: [item.cartId] };
    } else {
      acc[item.id].quantity += 1;
      acc[item.id].cartIds.push(item.cartId);
    }
    return acc;
  }, {});
  
  const groupedCart = Object.values(groupedCartInfo);


  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
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
              {groupedCart.map((group) => (
                <div key={group.item.id} className="cart-item glass">
                  <img src={group.item.imageUrl} alt={group.item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{group.item.name}</h4>
                    <span className="text-red">{group.item.price * group.quantity} DZD</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '8px' }}>
                    <button style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => removeFromCart(group.cartIds[group.cartIds.length - 1])}>−</button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{group.quantity}</span>
                    <button style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => addToCart(group.item)}>+</button>
                  </div>

                  <button className="remove-item" onClick={() => {
                    group.cartIds.forEach(id => removeFromCart(id));
                  }} style={{ marginLeft: '1rem' }}>
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
