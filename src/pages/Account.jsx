import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const Account = () => {
  const { user, signInWithGoogle, signOut, isLoggingIn } = useApp();

  if (user) {
    return <Navigate to="/merchants" replace />;
  }

  return (
    <div className="account-page container" style={{ paddingTop: '5rem', maxWidth: '600px' }}>
      <section className="login-section glass" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
        <div className="user-icon-wrapper" style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(255,0,0,0.1)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '0 auto 2rem' 
        }}>
          <User size={40} className="text-red" />
        </div>
        <h2 className="title-lg" style={{ marginBottom: '1rem' }}>Sign In to <span className="text-red">Menu</span></h2>
        <p className="text-muted" style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
          Login with your Gmail account to manage orders, merchants, and delivery applications.
        </p>
        
        <button 
          className="google-signin-btn glass" 
          onClick={signInWithGoogle}
          disabled={isLoggingIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            background: 'white',
            color: '#1f1f1f',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none'
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px' }} />
          {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p className="text-muted" style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
          <ShieldCheck size={20} className="text-muted" />
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>Secure connection verified</span>
        </div>
      </section>
      
      <div className="mobile-nav-spacer"></div>
    </div>
  );
};

export default Account;
