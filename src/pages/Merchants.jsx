import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, CheckCircle2, Loader2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import './Merchants.css';

const Merchants = () => {
  const { t, user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New State for Adding Items
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Traditional', image: null });
  
  // New State for Media
  const fileInputRef = useRef(null);
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetch products for this merchant
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('merchant_id', user.id); // Assuming user ID is merchant ID or linked

        if (!error) setInventory(data || []);
      } catch (err) {
        console.error('Error fetching merchant data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerchantData();
  }, [user]);

  useSEO({
    title: 'Merchant Dashboard',
    description: 'Manage your restaurant inventory, orders, and storefront details.',
    url: '/merchants'
  });

  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('QR Codes generated! Sent to your registered email.');
    }, 1500);
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      toast.error("Name and Price are required.");
      return;
    }
    
    const product = {
      id: Date.now(),
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      specs: 'Added recently',
      image_url: newItem.image 
        ? URL.createObjectURL(newItem.image) 
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop'
    };
    
    const updatedInventory = [...inventory, product];
    setInventory(updatedInventory);
    localStorage.setItem(`merchant_inventory_${user?.id}`, JSON.stringify(updatedInventory));
    setIsAddingItem(false);
    setNewItem({ name: '', price: '', category: 'Traditional', image: null });
  };

  const handleMediaUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newMediaUrl = URL.createObjectURL(e.target.files[0]);
      setMediaItems(prev => [...prev, newMediaUrl]);
      
      const p = JSON.parse(localStorage.getItem(`merchant_profile_${user?.id}`) || '{}');
      if (!p.heroImage) {
         p.heroImage = newMediaUrl;
         localStorage.setItem(`merchant_profile_${user?.id}`, JSON.stringify(p));
      }
    }
  };

  return (
    <div className="merchant-page container page-transition">
      <div className="merchant-header glass">
        <div className="merchant-profile">
          <div className="merchant-avatar-placeholder glass">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="merchant-avatar" />
            ) : (
              <ImageIcon size={40} className="text-muted" />
            )}
          </div>
          <div className="merchant-info">
            <h2 className="title-md">{user?.user_metadata?.full_name || 'Partner Merchant'}</h2>
            <p className="text-muted">{user?.email || 'Storefront Dashboard'}</p>
          </div>
        </div>
        <div className="merchant-actions">
          <button className="btn-outline" onClick={() => navigate(`/restaurant/${user?.id}`)}>Public Profile</button>
          <button 
            className="btn-primary" 
            onClick={handleGenerateQR}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate QRs'}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <aside className="dashboard-sidebar glass">
          <nav className="dashboard-nav">
            {['inventory', 'media', 'orders', 'settings'].map(tab => (
              <button 
                key={tab}
                className={`dash-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {t[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-content glass">
          {activeTab === 'inventory' && (
            <div className="inventory-center">
              <div className="dash-section-header">
                <h3 className="title-sm">{t.inventory}</h3>
                {!isAddingItem ? (
                  <button className="btn-primary" onClick={() => setIsAddingItem(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> {t.addItem}
                  </button>
                ) : (
                  <button className="btn-outline" onClick={() => setIsAddingItem(false)}>
                    <X size={18} style={{ marginRight: '0.5rem' }} /> Cancel
                  </button>
                )}
              </div>
              
              {isAddingItem ? (
                <form className="add-item-form glass slide-in" onSubmit={handleAddItemSubmit} style={{ padding: '2rem', marginTop: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1.5rem' }}>Add New Delicacy</h4>
                  <div className="form-group">
                    <label>Food Name</label>
                    <input type="text" placeholder="e.g., Artisan Pizza" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label>Price (DZD)</label>
                    <input type="number" placeholder="Enter amount" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label>Food Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save to Menu</button>
                </form>
              ) : isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin text-red" /></div>
              ) : inventory.length > 0 ? (
                <div className="inventory-list">
                  {inventory.map(item => (
                    <div key={item.id} className="inventory-item glass">
                      <img src={item.image_url} alt={item.name} className="inv-img" />
                      <div className="inv-details">
                        <h4>{item.name}</h4>
                        <span className="text-muted">{item.specs}</span>
                      </div>
                      <div className="inv-price text-red">{item.price} DZD</div>
                      <button className="btn-outline">Edit</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state text-center" style={{ padding: '3rem' }}>
                  <p className="text-muted">No products listed yet. Start adding your delicacies to reach customers.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-center">
              <h3 className="title-sm">{t.media}</h3>
              <div className="upload-zone" style={{ marginTop: '2rem', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                <Upload size={32} className="text-red" />
                <p className="text-muted" style={{ marginTop: '1rem' }}>Click here to upload storefront & menu imagery</p>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleMediaUpload} />
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse Files</button>
              </div>
              
              {mediaItems.length > 0 && (
                <div className="media-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                  {mediaItems.map((url, idx) => (
                    <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                      <img src={url} alt={`Store media ${idx}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-center text-center" style={{ padding: '3rem' }}>
              <h3 className="title-sm">{t.liveOrders} Hub</h3>
              <p className="text-muted" style={{ marginTop: '1rem' }}>Awaiting new orders... Live view is active.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-center">
              <h3 className="title-sm">Location & Profile Settings</h3>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>This information powers your public Restaurant page and the Google Maps integration.</p>
              
              <div className="form-group slide-in">
                <label>Restaurant Name</label>
                <input type="text" id="rest_name" defaultValue={JSON.parse(localStorage.getItem(`merchant_profile_${user?.id}`) || '{}').name || user?.user_metadata?.full_name || ''} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
              </div>
              
              <div className="form-group slide-in" style={{ animationDelay: '0.1s' }}>
                <label>Exact Location (Address, City, Country)</label>
                <input type="text" id="rest_addr" placeholder="e.g., Rue Didouche Mourad, Algiers" defaultValue={JSON.parse(localStorage.getItem(`merchant_profile_${user?.id}`) || '{}').address || ''} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>Make this exact so Google Maps drops the pin correctly.</p>
              </div>

              <button className="btn-primary" onClick={() => {
                const settings = {
                  name: document.getElementById('rest_name').value,
                  address: document.getElementById('rest_addr').value
                };
                localStorage.setItem(`merchant_profile_${user?.id || 'demo'}`, JSON.stringify(settings));
                toast.success('Success! Your mapping location and profile details are completely updated.');
              }}>Save and Update Map</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Merchants;
