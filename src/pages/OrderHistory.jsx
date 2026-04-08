import React from 'react';
import { Clock } from 'lucide-react';

// import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useSEO } from '../hooks/useSEO';

const OrderHistory = () => {
  // const navigate = useNavigate();

  useSEO({
    title: 'Order History',
    description: 'Track and review your past orders.',
    url: '/history'
  });

  return (
    <div className="container page-transition" style={{ paddingTop: '8rem', minHeight: '100vh', maxWidth: '800px' }}>
      <h2 className="title-lg" style={{ marginBottom: '2rem' }}>Order <span className="text-red">History</span></h2>
      <EmptyState 
        icon={Clock} 
        title="No Past Orders" 
        message="You haven't placed any orders yet. Once you complete a checkout, your receipt and tracking will appear here."
      />
    </div>
  );
};

export default OrderHistory;
