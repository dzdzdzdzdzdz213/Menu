import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="empty-state glass" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      borderRadius: '16px',
      margin: '2rem 0'
    }}>
      {Icon && <Icon size={48} className="text-muted" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />}
      <h3 className="title-md" style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p className="text-muted" style={{ maxWidth: '400px', marginBottom: action ? '2rem' : '0' }}>
        {message}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;
