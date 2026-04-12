import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ChevronLeft, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

const Checkout = () => {
  const { cart, removeFromCart, trackEvent } = useApp();
  const navigate = useNavigate();
  const [isPlaced, setIsPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useSEO({
    title: 'Secure Checkout',
    description: 'Review your cart and confirm your order securely.',
    url: '/checkout'
  });

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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const firstItem = cart[0];
      const merchantId = firstItem.merchant_id;
      
      // Fetch Merchant Profile for WhatsApp
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', merchantId)
        .single();
      
      if (error || !profile) {
        toast.error('Could not find seller contact information');
        setIsProcessing(false);
        return;
      }

      const whatsappNum = profile.whatsapp || profile.phone;
      const restaurantName = profile.full_name;

      if (!whatsappNum) {
        toast.error('Seller WhatsApp not available');
        setIsProcessing(false);
        return;
      }

      // Track conversion
      trackEvent('whatsapp_click', merchantId);
      
      // Build order text
      let text = `Hello *${restaurantName}*, I would like to place an order from Menu platform:%0A%0A`;
      groupedCart.forEach(g => {
        text += `- ${g.quantity}x ${g.item.name} (${g.item.price * g.quantity} DZD)%0A`;
      });
      text += `%0A*Subtotal:* ${total} DZD%0A*Delivery + Fees:* 350 DZD%0A*Total:* ${total + 350} DZD%0A%0A`;
      text += `Please let me know how long it will take. My address is being provided in the next message.`;
      
      const waUrl = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${text}`;
      
      setIsProcessing(false);
      setIsPlaced(true);
      toast.success("Redirecting to WhatsApp...");
      
      // Clear cart
      groupedCart.forEach(group => {
        group.cartIds.forEach(id => removeFromCart(id));
      });
      
      window.open(waUrl, '_blank');
      
    } catch(err) {
      console.error(err);
      toast.error('Failed to process order.');
      setIsProcessing(false);
    }
  };

  if (isPlaced) {
    return (
      <div className="container page-transition" style={{ paddingTop: '8rem', minHeight: '100vh', maxWidth: '800px', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '5rem 2rem', borderRadius: '24px' }}>
          <CheckCircle2 size={80} className="text-red" style={{ margin: '0 auto 2rem' }} />
          <h2 className="title-lg" style={{ marginBottom: '1rem' }}>Success!</h2>
          <p className="text-muted" style={{ marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
            We've sent your order details to the shop via WhatsApp. Please continue the conversation there.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
             <button className="btn-primary" onClick={() => navigate('/')}>Continue Exploring</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-transition" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh', maxWidth: '1000px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={20} /> Back
      </button>

      <h2 className="title-lg" style={{ marginBottom: '3rem' }}>Secure <span className="text-red">Checkout</span></h2>

      {cart.length === 0 ? (
        <EmptyState 
          icon={CreditCard} 
          title="Checkout Unavailable" 
          message="There are no items in your cart to checkout."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem' }}>
          {/* Order Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
               <h3 className="title-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={22} className="text-red" /> Delivery Details</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>You will provide your exact location and details to the merchant on WhatsApp once you confirm the order.</p>
               </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
               <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>Review Items</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {groupedCart.map((group) => {
                    const imgSrc = group.item.imageUrl || group.item.image_url;
                    return (
                    <div key={group.item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       {imgSrc ? (
                          <img src={imgSrc} alt={group.item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                       ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🍽️</div>
                       )}
                       <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{group.item.name}</h4>
                          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Qty: {group.quantity}</p>
                       </div>
                       <div style={{ fontWeight: 700 }}>{group.item.price * group.quantity} DZD</div>
                    </div>
                  );
                 })}
               </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
              <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal</span>
                  <span>{total} DZD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Delivery & Fees</span>
                  <span>350 DZD</span>
                </div>
                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span className="text-red">{total + 350} DZD</span>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '10px' }} 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : <><Phone size={20} /> Order on WhatsApp</>}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem' }} className="text-muted">
                 Secure connection via Supabase
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Checkout;
