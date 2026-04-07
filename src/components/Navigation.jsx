import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
<<<<<<< HEAD
import { Home, Compass, User, Search, ShoppingBag, Globe, Sun, Moon } from 'lucide-react';
=======
import { Home, ShoppingBag } from 'lucide-react';
>>>>>>> b3dd1fa (multiple)
import { useApp } from '../context/AppContext';
import RegionSelector from './RegionSelector';
import AccountSidebar from './AccountSidebar';
import './Navigation.css';

const Navigation = () => {
<<<<<<< HEAD
  const { t, cart, setIsCartOpen, theme, toggleTheme, lang, setLang } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AccountSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Desktop Top Header */}
      <header className="desktop-header glass">
        <div className="header-container">
          {/* Logo triggers the Sidebar */}
          <button className="logo-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setIsSidebarOpen(true)}>
            <h1 className="logo-text" style={{ fontSize: '1.25rem' }}>Menu<span className="text-red">.</span></h1>
          </button>

          <nav className="desktop-nav" style={{ flex: 1, justifyContent: 'center' }}>
=======
  const { cart, setIsCartOpen } = useApp();

  return (
    <>
      <header className="desktop-header glass slide-in">
        <div className="header-container">
          
          {/* Logo */}
          <NavLink to="/" className="logo-link">
            <h1 className="logo-text">Restaurant<span className="logo-dot">.</span></h1>
          </NavLink>

          {/* Universal Nav Links */}
          <nav className="desktop-nav">
>>>>>>> b3dd1fa (multiple)
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
               Menu
            </NavLink>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
               Admin Dashboard
            </NavLink>
          </nav>

          {/* Command Actions */}
          <div className="header-actions">
<<<<<<< HEAD
            {/* Language & Theme toggles restored */}
            <div className="lang-switcher">
              <button className="icon-btn" title="Switch Language">
                <Globe size={20} />
                <span className="lang-code">{lang.toUpperCase()}</span>
              </button>
              <div className="lang-dropdown glass">
                <button onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''}>English</button>
                <button onClick={() => setLang('fr')} className={lang === 'fr' ? 'active' : ''}>Français</button>
                <button onClick={() => setLang('ar')} className={lang === 'ar' ? 'active' : ''}>العربية</button>
              </div>
            </div>

            <button id="theme-toggle" className="icon-btn theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="action-divider"></div>

            {/* Region Selector */}
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
              <RegionSelector />
            </div>

            <NavLink to="/search" className="icon-btn"><Search size={20} /></NavLink>
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>

            <div className="action-divider"></div>

            <NavLink to="/account" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{t.signIn}</NavLink>
=======
            <button className="icon-btn cart-btn chromatic-shift" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={18} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
>>>>>>> b3dd1fa (multiple)
          </div>
        </div>
      </header>

      {/* Mobile Orbital HUD */}
      <nav className="mobile-nav glass slide-in">
        <NavLink to="/" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
<<<<<<< HEAD
          <Home size={24} />
          <span>{t.home}</span>
        </NavLink>
        <NavLink to="/merchants" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <Compass size={24} />
          <span>Discover</span>
        </NavLink>
        <button onClick={() => setIsSidebarOpen(true)} className="mobile-nav-item" style={{ background: 'none', border: 'none' }}>
          <div style={{ background: 'var(--color-red)', borderRadius: '50%', padding: '0.5rem', marginTop: '-1rem', boxShadow: '0 4px 12px rgba(255,0,0,0.3)', color: 'white' }}>
            <Search size={24} />
          </div>
          <span style={{ marginTop: '0.25rem' }}>Omni-Search</span>
        </button>
        <NavLink to="/delivery" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <ShoppingBag size={24} />
          <span>Cart</span>
        </NavLink>
        <NavLink to="/account" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <User size={24} />
          <span>Profile</span>
=======
          <Home size={22} />
>>>>>>> b3dd1fa (multiple)
        </NavLink>
        <button onClick={() => setIsCartOpen(true)} className="mobile-nav-item" style={{background: 'transparent', border: 'none', position: 'relative'}}>
          <ShoppingBag size={22} />
          {cart.length > 0 && <span className="cart-badge" style={{position: 'absolute', top: -5, right: -5, padding: '2px 5px', fontSize: '10px'}}>{cart.length}</span>}
        </button>
      </nav>
    </>
  );
};

export default Navigation;
