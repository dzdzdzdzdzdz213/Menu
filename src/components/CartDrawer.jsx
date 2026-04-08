import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart } = useApp();
  const { addToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const triggerWhatsAppOrder = () => {
    setIsCheckingOut(true);
    
    let orderText = "Hello! I would like to order:\n\n";
    cart.forEach(item => {
      orderText += `- ${item.name} (${item.price} DZD)\n`;
    });
    orderText += `\nTotal: ${cartTotal} DZD\n\nIs this available?`;
    
    const encodedText = encodeURIComponent(orderText);
    const phoneNumber = "213555555555";
    
    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
      setCheckoutDone(true);
      setIsCheckingOut(false);
      addToast('Redirecting to WhatsApp for order confirmation.', 'success');
    }, 1000);
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
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="price">{item.price} DZD</span>
                </div>
                <button className="btn-icon text-red" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
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
                onClick={triggerWhatsAppOrder}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Order via WhatsApp</>
                )}
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
