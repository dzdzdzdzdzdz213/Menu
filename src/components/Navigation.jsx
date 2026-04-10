import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, User, Store, Shield, ChevronDown, Globe, ChevronRight } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import i18n from '../lib/i18n';
import './Navigation.css';

const Navigation = () => {
  const { cart, setIsCartOpen, user, signOut } = useApp();
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();

  const handlePortalTouch = (e) => {
    // For mobile, we want to toggle on click
    if (window.innerWidth <= 900) {
      e.preventDefault();
      setIsPortalOpen(!isPortalOpen);
    }
  };

  const handleSignOut = () => {
    signOut();
    setIsPortalOpen(false);
    navigate('/');
  };

  const PORTALS = [
    { icon: User,   label: 'Customer Portal', sub: 'Orders & profile',      path: '/account',   color: 'rgba(255,255,255,0.9)' },
    { icon: Store,  label: 'Merchant Portal', sub: 'Manage restaurant',     path: '/merchants', color: '#ff9100' },
    { icon: Shield, label: 'Admin Portal',    sub: 'Platform management',   path: '/admin',     color: '#ff3333' },
  ];

  const LANGS = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'fr', label: '🇫🇷 FR' },
    { code: 'ar', label: '🇩🇿 AR' },
  ];

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  return (
    <>
      <header className="desktop-header">
        <div className="header-container">

          {/* Logo */}
          <NavLink to="/" className="logo-link">
            <h1 className="logo-text">Menu<span className="logo-dot">.</span></h1>
          </NavLink>

          {/* Nav Links */}
          <nav className="desktop-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>

            {/* Portal Dropdown */}
            <div
              className="nav-dropdown-container"
              onMouseEnter={() => window.innerWidth > 900 && setIsPortalOpen(true)}
              onMouseLeave={() => window.innerWidth > 900 && setIsPortalOpen(false)}
            >
              <button 
                className={`nav-item nav-dropdown-trigger ${isPortalOpen ? 'active' : ''}`}
                onClick={handlePortalTouch}
              >
                Dashboards <ChevronDown size={14} style={{ marginLeft: 4, transition: 'transform 0.3s', transform: isPortalOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {isPortalOpen && (
                <div className="nav-dropdown-menu slide-in-top">
                  <div className="dropdown-header">
                    <span className="dropdown-label">Workspace Hub</span>
                    {user && (
                      <button className="text-red x-small-btn" onClick={handleSignOut}>Sign Out</button>
                    )}
                  </div>
                  <div className="dropdown-divider" />
                  {PORTALS.map(p => (
                    <button
                      key={p.path}
                      className="dropdown-portal-item"
                      onClick={() => { setIsPortalOpen(false); navigate(p.path); }}
                    >
                      <div className="dp-icon" style={{ background: p.color + '15', color: p.color }}>
                        <p.icon size={18} />
                      </div>
                      <div className="dp-text">
                        <span className="dp-label" style={{ color: p.color }}>{p.label}</span>
                        <span className="dp-sub">{p.sub}</span>
                      </div>
                      <ChevronRight size={14} className="dp-arrow" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Explore
            </NavLink>
          </nav>

          {/* Right side actions */}
          <div className="header-actions">
            {/* Language Switcher */}
            <div
              className="lang-switcher-btn nav-dropdown-container"
              onMouseEnter={() => setIsLangOpen(true)}
              onMouseLeave={() => setIsLangOpen(false)}
            >
              <button className="icon-btn lang-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
                <Globe size={17} />
                <span className="lang-code">{currentLang.code.toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <div className="nav-dropdown-menu" style={{ right: 0, left: 'auto', minWidth: '140px' }}>
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={`dropdown-portal-item ${i18n.language === l.code ? 'dp-active' : ''}`}
                      onClick={() => { i18n.changeLanguage(l.code); setIsLangOpen(false); }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)} title="Cart">
              <ShoppingBag size={19} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>

            {/* Account shortcut */}
            <button className="icon-btn" onClick={() => navigate(user ? '/account' : '/account')} title="Account">
              {user ? (
                <div 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  {user.user_metadata?.full_name?.charAt(0) || 'U'}
                </div>
              ) : (
                <User size={19} />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} /><span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Store size={22} /><span>Explore</span>
        </NavLink>
        <button className="mobile-nav-item" style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer', color: 'inherit' }} onClick={() => setIsCartOpen(true)}>
          <ShoppingBag size={22} />
          {cart.length > 0 && <span className="cart-badge" style={{ position: 'absolute', top: -4, right: -4 }}>{cart.length}</span>}
          <span>Cart</span>
        </button>
        <NavLink to="/account" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} /><span>Account</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
