import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, ChevronDown, ChevronUp, ExternalLink, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../hooks/useApp';
import EmptyState from '../components/EmptyState';
import { useSEO } from '../hooks/useSEO';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useSEO({
    title: 'Order History',
    description: 'Track and review your past orders.',
    url: '/history'
  });

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, profiles(full_name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Fetch orders error:', err);
        toast.error('Could not load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '8rem', minHeight: '100vh', maxWidth: '800px' }}>
        <h2 className="title-lg" style={{ marginBottom: '2rem' }}>Order <span className="text-red">History</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass skeleton" style={{ height: '100px', borderRadius: '16px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container page-transition" style={{ paddingTop: '8rem', minHeight: '100vh', maxWidth: '800px', paddingBottom: '4rem' }}>
      <h2 className="title-lg" style={{ marginBottom: '2rem' }}>Order <span className="text-red">History</span></h2>
      
      {orders.length === 0 ? (
        <EmptyState 
          icon={Clock} 
          title="No Past Orders" 
          message="You haven't placed any orders yet. Once you complete a checkout, your receipt and tracking will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
              <div 
                onClick={() => toggleExpand(order.id)}
                style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag className="text-red" size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {order.profiles?.full_name || 'Merchant'}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }} className="text-muted">
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> {order.total + (order.delivery_fee || 0)} DZD</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge-glass ${order.status}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {order.status}
                  </span>
                  {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedId === order.id && (
                <div className="slide-in-top" style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                  <div style={{ paddingTop: '1.5rem' }}>
                    <h4 className="title-sm" style={{ marginBottom: '1rem' }}>Order details</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span className="text-muted">{item.quantity}x {item.name}</span>
                          <span style={{ fontWeight: 600 }}>{item.price * item.quantity} DZD</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }} className="text-muted">
                          <span>Subtotal</span>
                          <span>{order.total} DZD</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }} className="text-muted">
                          <span>Delivery Fee</span>
                          <span>{order.delivery_fee || 0} DZD</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                          <span>Total</span>
                          <span className="text-red">{order.total + (order.delivery_fee || 0)} DZD</span>
                       </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                       <button className="btn-outline w-100" style={{ padding: '0.75rem', fontSize: '0.85rem' }} onClick={() => toast.success('Tracking coming soon...')}>
                         Track Delivery
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
