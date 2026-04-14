import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Lock, LogOut, ArrowRight, Settings, ShoppingBag, Store } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import './Home.css';

const Account = () => {
  const { user, userProfile, signInWithGoogle, isLoggingIn, signOut, loading } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  useSEO({
    title: 'Your Account',
    description: 'Manage your settings, orders, and delivery addresses.',
    url: '/account'
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  // Redirection Logic
  useEffect(() => {
    if (!loading && user) {
      if (!userProfile?.phone || !userProfile?.age) {
        navigate('/setup-profile', { state: { fromAuth: true } });
      }
    }
  }, [user, userProfile, loading, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message || "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading session...</div>;

  if (user && userProfile?.phone) {
    return (
      <div className="account-page container page-transition" style={{ paddingTop: '8rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
               {userProfile.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="title-md" style={{ margin: 0 }}>{userProfile.full_name}</h2>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>{user.email}</p>
              <span className={`badge-glass ${userProfile.role}`} style={{ fontSize: '0.8rem' }}>{userProfile.role.toUpperCase()}</span>
            </div>
          </div>

          <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-box glass clickable" onClick={() => navigate('/history')} style={{ padding: '1.5rem', textAlign: 'center' }}>
              <ShoppingBag size={24} className="text-red" style={{ marginBottom: '0.5rem' }} />
              <div>Order History</div>
            </div>
            
            {userProfile.role === 'seller' && (
              <div className="stat-box glass clickable" onClick={() => navigate('/seller-dashboard')} style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--color-orange)' }}>
                <Store size={24} style={{ color: 'var(--color-orange)', marginBottom: '0.5rem' }} />
                <div style={{ color: 'var(--color-orange)' }}>Manage Shop</div>
              </div>
            )}

            {userProfile.role === 'admin' && (
              <div className="stat-box glass clickable" onClick={() => navigate('/admin')} style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--color-red)' }}>
                <ShieldCheck size={24} className="text-red" style={{ marginBottom: '0.5rem' }} />
                <div className="text-red">Admin Panel</div>
              </div>
            )}

            <div className="stat-box glass clickable" onClick={signOut} style={{ padding: '1.5rem', textAlign: 'center' }}>
              <LogOut size={24} className="text-muted" style={{ marginBottom: '0.5rem' }} />
              <div>Sign Out</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page container page-transition" style={{ paddingTop: '5rem', maxWidth: '600px' }}>
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
        <h2 className="title-lg" style={{ marginBottom: '1rem' }}>Welcome to <span className="text-red">Menu</span></h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Sustainable gastronomy for the digital age.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            className="google-signin-btn glass" 
            onClick={signInWithGoogle}
            disabled={isLoggingIn}
            style={{ width: '100%', padding: '1.2rem', borderRadius: '14px', background: 'white', color: '#111', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '18px' }} />
            {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--glass-border)', zIndex: 0 }}></div>
          <span style={{ position: 'relative', background: 'rgba(20,20,20,1)', padding: '0 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', zIndex: 1 }}>OR ADMIN LOGIN</span>
        </div>

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <div style={{ position: 'relative' }}>
              <Mail size={18} className="text-muted" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email" 
                className="base-input"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} className="text-muted" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="base-input"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '1rem', borderRadius: '12px' }}>
            {isLoading ? 'Confirming...' : 'Sign In as Admin'}
          </button>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
          <ShieldCheck size={20} className="text-muted" />
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>Secure verified endpoint</span>
        </div>
      </section>
    </div>
  );
};

export default Account;
