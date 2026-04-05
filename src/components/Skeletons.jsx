import React from 'react';

export const FoodCardSkeleton = () => {
  return (
    <div className="food-card glass" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="skeleton-pulse" style={{ height: '200px', width: '100%', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="skeleton-pulse" style={{ height: '24px', width: '70%', marginBottom: '0.5rem' }} />
            <div className="skeleton-pulse" style={{ height: '16px', width: '40%' }} />
          </div>
          <div className="skeleton-pulse" style={{ height: '24px', width: '40px', borderRadius: '12px' }} />
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-pulse" style={{ height: '24px', width: '60px' }} />
          <div className="skeleton-pulse" style={{ height: '36px', width: '36px', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  );
};

export const RestaurantHeaderSkeleton = () => {
  return (
    <div style={{ width: '100%', height: '40vh', position: 'relative' }} className="skeleton-pulse">
      <div className="container" style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0' }}>
         <div className="skeleton-pulse" style={{ height: '48px', width: '250px', marginBottom: '1rem', background: 'rgba(255,255,255,0.2)' }} />
         <div style={{ display: 'flex', gap: '1.5rem' }}>
           <div className="skeleton-pulse" style={{ height: '20px', width: '150px', background: 'rgba(255,255,255,0.2)' }} />
           <div className="skeleton-pulse" style={{ height: '20px', width: '100px', background: 'rgba(255,255,255,0.2)' }} />
           <div className="skeleton-pulse" style={{ height: '20px', width: '120px', background: 'rgba(255,255,255,0.2)' }} />
         </div>
      </div>
    </div>
  );
};
