import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navigation.css';

const Navigation = () => {
  const { cart, setIsCartOpen } = useApp();

  return (
    <>
      <header className="desktop-header glass slide-in">
        <div className="header-container">
          {/* Logo */}
          <NavLink to="/" className="logo-link">
            <h1 className="logo-text">Menu<span className="logo-dot">.</span></h1>
          </NavLink>

          {/* Universal Nav Links */}
          <nav className="desktop-nav">
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
               Menu
            </NavLink>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
               Admin Dashboard
            </NavLink>
          </nav>

          {/* Command Actions */}
          <div className="header-actions">
            <button className="icon-btn cart-btn chromatic-shift" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={18} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Orbital HUD */}
      <nav className="mobile-nav glass slide-in">
        <NavLink to="/" className={({isActive}) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <Home size={22} />
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
