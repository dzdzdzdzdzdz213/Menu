import React, { useState } from 'react';
<<<<<<< HEAD
import { X, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
=======
import { X, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
>>>>>>> b3dd1fa (multiple)
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './CartDrawer.css';

const CartDrawer = () => {
<<<<<<< HEAD
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, addToCart, t, user } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
=======
  const { isCartOpen, setIsCartOpen, cart, removeFromCart } = useApp();
  const { addToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
>>>>>>> b3dd1fa (multiple)

  if (!isCartOpen) return null;

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleRemove = (cartId, name) => {
    removeFromCart(cartId);
  };

<<<<<<< HEAD
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
=======
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Construct WhatsApp message
    const itemsList = cart.map((item, index) => `${index + 1}. ${item.name} - ${Number(item.price).toLocaleString()} DZD`).join('\n');
    const message = encodeURIComponent(
      `*New Order*\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Total:* ${total.toLocaleString()} DZD\n\n` +
      `_Please confirm my order._`
    );

    // Default WhatsApp number
    const whatsappNumber = "213555555555"; 

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutDone(true);
      addToast('🚀 Opening WhatsApp...', 'success');
      
      // Open WhatsApp chat
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener');

      setTimeout(() => {
        setCheckoutDone(false);
        setIsCartOpen(false);
      }, 1500);
    }, 800);
>>>>>>> b3dd1fa (multiple)
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer glass" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="title-md">
            Your Order <span className="gradient-text">({cart.length})</span>
          </h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={52} className="text-muted" />
              <p className="text-muted" style={{ fontSize: '1rem', marginTop: '1rem' }}>No items yet</p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)} style={{ marginTop: '1.5rem' }}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-items">
<<<<<<< HEAD
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
=======
              {cart.map(item => (
                <div key={item.cartId} className="cart-item glass">
                  <img
                    src={item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="gradient-text" style={{ fontWeight: 700 }}>{Number(item.price).toLocaleString()} DZD</span>
                  </div>
                  <button className="remove-item" onClick={() => handleRemove(item.cartId, item.name)}>
                    <Trash2 size={17} />
>>>>>>> b3dd1fa (multiple)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total</span>
              <span className="gradient-text">{total.toLocaleString()} DZD</span>
            </div>
            <button
              className="btn-primary checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || checkoutDone}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {checkoutDone ? (
                <><CheckCircle size={18} style={{ display: 'inline', marginRight: 8 }} />Sent!</>
              ) : isCheckingOut ? (
                <><Loader2 size={18} className="animate-spin" style={{ display: 'inline', marginRight: 8 }} />Preparing...</>
              ) : (
                'Order via WhatsApp'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
