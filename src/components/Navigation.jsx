import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, ChevronDown, User, Star, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import './Navigation.css';

const Navigation = () => {
  const { cart, setIsCartOpen } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setIsMenuOpen(false);
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

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
            <div 
              className="nav-dropdown-container"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button className="nav-item nav-dropdown-trigger" onClick={() => navigate('/')}>
                Menu <ChevronDown size={14} style={{ marginLeft: 4 }} />
              </button>
              
              {isMenuOpen && (
                <div className="nav-dropdown-menu glass slide-in" style={{ animationDuration: '0.2s' }}>
                  <div className="dropdown-section">
                    <h4>Account</h4>
                    <button onClick={() => navigate('/admin')}><User size={14} /> My Profile</button>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-section">
                    <h4>Cuisine Categories</h4>
                    <button onClick={() => handleCategoryClick('Sweets')}><UtensilsCrossed size={14} /> Sweets & Desserts</button>
                    <button onClick={() => handleCategoryClick('Traditional Sweets')}><UtensilsCrossed size={14} /> Traditional Sweets</button>
                    <button onClick={() => handleCategoryClick('Japanese')}><UtensilsCrossed size={14} /> Japanese</button>
                    <button onClick={() => handleCategoryClick('Chinese')}><UtensilsCrossed size={14} /> Chinese</button>
                    <button onClick={() => handleCategoryClick('Traditional Restaurants')}><UtensilsCrossed size={14} /> Traditional Restaurants</button>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-section">
                    <button onClick={() => { setIsMenuOpen(false); navigate('/'); }} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                      <Star size={14} /> Browse Top Restaurants
                    </button>
                  </div>
                </div>
              )}
            </div>
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
