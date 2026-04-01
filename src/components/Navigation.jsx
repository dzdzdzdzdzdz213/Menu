import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, User, Search, ShoppingBag, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navigation.css';

const Navigation = () => {
  const { t, theme, toggleTheme, lang, setLang, cart, setIsCartOpen } = useApp();
  return (
    <>
      {/* Desktop Top Header */}
      <header className="desktop-header glass">
        <div className="header-container">
          <NavLink to="/" className="logo-link">
            <h1 className="logo-text">Menu<span className="text-red">.</span></h1>
          </NavLink>

          <nav className="desktop-nav">
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              {t.home}
            </NavLink>
            <NavLink to="/heritage" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              {t.heritage}
            </NavLink>
            <NavLink to="/merchants" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              {t.merchants}
            </NavLink>
            <NavLink to="/delivery" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              {t.delivery}
            </NavLink>
          </nav>

          <div className="header-actions">
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

            <NavLink to="/search" className="icon-btn"><Search size={20} /></NavLink>
            <button id="theme-toggle" className="icon-btn theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            <NavLink to="/account" className="btn-primary">{t.signIn}</NavLink>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav glass">
        <NavLink to="/" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <Home size={24} />
          <span>{t.home}</span>
        </NavLink>
        <NavLink to="/merchants" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <Compass size={24} />
          <span>{t.merchants}</span>
        </NavLink>
        <NavLink to="/search" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <Search size={24} />
          <span>{t.trending}</span>
        </NavLink>
        <NavLink to="/delivery" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <ShoppingBag size={24} />
          <span>{t.delivery}</span>
        </NavLink>
        <NavLink to="/account" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <User size={24} />
          <span>{t.signIn}</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
