import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import './Home.css';

const Account = () => {
  const { user, signInWithGoogle, isLoggingIn } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  
  useSEO({
    title: 'Your Account',
    description: 'Manage your settings, orders, and delivery addresses.',
    url: '/account'
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/merchants';

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the validation errors");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    const { data: _data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message || "Failed to sign in. Please try again.");
    } else {
      toast.success("Successfully logged in!");
      navigate(redirectPath, { replace: true });
    }
  };

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
        <h2 className="title-lg" style={{ marginBottom: '1rem' }}>Sign In to <span className="text-red">Menu</span></h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Explore the world's finest Mediterranean delicacies.
        </p>

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} className="text-muted" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: null })) }}
                placeholder="you@example.com" 
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: `1px solid ${errors.email ? 'var(--color-red)' : 'var(--glass-border)'}`, background: 'rgba(0,0,0,0.3)', color: 'white' }}
              />
            </div>
            {errors.email && <span style={{ color: 'var(--color-red)', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>{errors.email}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} className="text-muted" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: null })) }}
                placeholder="Min. 6 characters" 
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: `1px solid ${errors.password ? 'var(--color-red)' : 'var(--glass-border)'}`, background: 'rgba(0,0,0,0.3)', color: 'white' }}
              />
            </div>
            {errors.password && <span style={{ color: 'var(--color-red)', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '1rem', borderRadius: '12px', fontSize: '1.1rem' }}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="google-signin-btn glass" 
            onClick={() => signInWithGoogle('customer')}
            disabled={isLoggingIn}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'white', color: '#111', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '18px' }} />
            {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setShowDemo(!showDemo)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showDemo ? 'Hide Developer Gateways' : 'Enter via Demo Gateways'}
          </button>

          {showDemo && (
            <div className="slide-in-top" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <button onClick={() => signInWithGoogle('merchant')} className="badge-glass" style={{ padding: '0.8rem', cursor: 'pointer', border: '1px solid var(--color-orange)', color: 'var(--color-orange)' }}>Merchant Board</button>
               <button onClick={() => signInWithGoogle('admin')} className="badge-glass" style={{ padding: '0.8rem', cursor: 'pointer', border: '1px solid var(--color-red)', color: 'var(--color-red)' }}>Admin Board</button>
            </div>
          )}
        </div>

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
