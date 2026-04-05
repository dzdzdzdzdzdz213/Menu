import React, { useState } from 'react';
import { X, User, Grid, Star, LogOut, MessageSquare, ChevronLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import QRCodeGenerator from './QRCodeGenerator';
import './AccountSidebar.css';

const CATEGORIES = ['Restaurants', 'Hotels', 'Experiences', 'Attractions', 'Cafes', 'Sweets'];

const AccountSidebar = ({ isOpen, onClose }) => {
  const { t } = useApp();
  const [view, setView] = useState('main'); // 'main', 'categories', 'top100'

  if (!isOpen) return null;

  const handleClose = () => {
    setView('main');
    onClose();
  };

  const renderMainContent = () => (
    <>
      <div className="profile-section">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-info">
          <h3>Guest User</h3>
          <p className="text-muted">Explore & Discover</p>
        </div>
      </div>

      <div className="sidebar-menu">
        <button className="sidebar-menu-item" onClick={() => setView('categories')}>
          <Grid size={20} />
          <span>Categories</span>
        </button>
        <button className="sidebar-menu-item" onClick={() => setView('top100')}>
          <Star size={20} className="text-red" />
          <span>Top 100 Places</span>
        </button>
        <button className="sidebar-menu-item">
          <MessageSquare size={20} />
          <span>My Reviews & Comments</span>
        </button>
      </div>

      <div className="sidebar-qr-section">
        <h4 style={{ marginBottom: '1rem' }}>Personal ID Badge</h4>
        <div className="qr-container-small">
          <QRCodeGenerator 
            tableId="USER-01" 
            restaurantName="My Menu Badge"
            vendorUrl="https://menu.app/user/profile"
          />
        </div>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
          Show this QR code at partner venues for quick loyalty points.
        </p>
      </div>
    </>
  );

  const renderCategories = () => (
    <div className="categories-view">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Grid size={20} /> Browse Categories
      </h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {CATEGORIES.map(cat => (
          <div key={cat} className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontWeight: 'bold' }}>{cat}</span>
            <ArrowRight size={18} className="text-muted" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTop100 = () => (
    <div className="top100-view">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Star size={20} className="text-red" /> Top 100 by Category
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {CATEGORIES.slice(0, 3).map(cat => (
          <div key={cat}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>{cat}</h4>
            <div className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-red)' }}>#1</span>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block' }}>Premium {cat}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>99+ more places</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="sidebar-overlay" onClick={handleClose}></div>
      <div className={`account-sidebar ${isOpen ? 'open' : ''} glass`}>
        <div className="sidebar-header">
          {view === 'main' ? (
            <h2>My Profile</h2>
          ) : (
            <button className="icon-btn" onClick={() => setView('main')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '-0.5rem' }}>
              <ChevronLeft size={24} /> Back
            </button>
          )}
          <button className="icon-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          {view === 'main' && renderMainContent()}
          {view === 'categories' && renderCategories()}
          {view === 'top100' && renderTop100()}
        </div>

        <div className="sidebar-footer">
          <button className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> Sign In / Register
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;
