import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, CheckCircle2, Loader2, Plus, X, ShoppingCart, Settings, Package, Film, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import './Merchants.css';

const MOCK_ORDERS = [
  { id: 'ORD-1024', customer: 'Imad Eddine', total: '2,450', status: 'Pending', time: '12 mins ago', items: '2x Pizza, 1x Soda' },
  { id: 'ORD-1025', customer: 'Sami B.', total: '1,200', status: 'Preparing', time: '5 mins ago', items: '1x Double Burger' },
  { id: 'ORD-1026', customer: 'Yasmine L.', total: '3,800', status: 'Ready', time: 'Just now', items: 'Couscous Royal, Traditional Salad' },
];

const Merchants = () => {
  const { user } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for Inventory
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Traditional', image: null });
  
  // State for Media & Profile
  const fileInputRef = useRef(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [profileSettings, setProfileSettings] = useState({
    name: user?.user_metadata?.full_name || '',
    address: '',
    category: 'Traditional',
    whatsapp: '',
    heroImage: ''
  });

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // 1. Fetch Profile from LocalStorage (Demo Mode)
        const localProf = JSON.parse(localStorage.getItem(`merchant_profile_${user.id}`) || '{}');
        setProfileSettings(prev => ({ ...prev, ...localProf }));

        // 2. Fetch Products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('merchant_id', user.id);

        const localInv = JSON.parse(localStorage.getItem(`merchant_inventory_${user.id}`) || '[]');
        
        if (!error && data && data.length > 0) {
          setInventory([...data, ...localInv]);
        } else {
          setInventory(localInv);
        }

        // 3. Fetch Media
        const savedMedia = JSON.parse(localStorage.getItem(`merchant_media_${user.id}`) || '[]');
        setMediaItems(savedMedia);

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

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      toast.error("Name and Price are required.");
      return;
    }
    
    setIsSaving(true);
    let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
    
    // In demo mode, we use base64 for local persistence
    if (newItem.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        finalImageUrl = reader.result;
        saveItem(finalImageUrl);
      };
      reader.readAsDataURL(newItem.image);
    } else {
      saveItem(finalImageUrl);
    }
  };

  const saveItem = (imageUrl) => {
    const product = {
      id: 'local-' + Date.now(),
      merchant_id: user?.id,
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      specs: 'Authentic preparation',
      image_url: imageUrl
    };
    
    const updatedInventory = [product, ...inventory];
    setInventory(updatedInventory);
    localStorage.setItem(`merchant_inventory_${user?.id}`, JSON.stringify(updatedInventory.filter(i => String(i.id).startsWith('local-'))));
    
    setIsAddingItem(false);
    setIsSaving(false);
    setNewItem({ name: '', price: '', category: 'Traditional', image: null });
    toast.success('Delicacy added successfully!');
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Delete this item from your menu?')) {
      const updatedInventory = inventory.filter(p => p.id !== itemId);
      setInventory(updatedInventory);
      localStorage.setItem(`merchant_inventory_${user?.id}`, JSON.stringify(updatedInventory.filter(i => String(i.id).startsWith('local-'))));
      toast.success('Item removed.');
    }
  };

  const handleMediaUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMediaUrl = reader.result;
        const updatedMedia = [newMediaUrl, ...mediaItems];
        setMediaItems(updatedMedia);
        localStorage.setItem(`merchant_media_${user?.id}`, JSON.stringify(updatedMedia));
        toast.success('Media uploaded to gallery');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveProfile = () => {
    setIsSaving(true);
    localStorage.setItem(`merchant_profile_${user?.id}`, JSON.stringify(profileSettings));
    
    // Store in global merchants map for Home page lookup
    const allMerchants = JSON.parse(localStorage.getItem('global_merchants_data') || '{}');
    allMerchants[user?.id || 'demo'] = {
      ...profileSettings,
      id: user?.id || 'demo'
    };
    localStorage.setItem('global_merchants_data', JSON.stringify(allMerchants));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Merchant profile synchronized!');
    }, 800);
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h2 className="title-md">Access Restricted</h2>
        <p className="text-muted">Please sign in as a merchant to access this board.</p>
        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/account')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="merchant-page container page-transition">
      {/* Header HUD */}
      <div className="merchant-header glass">
        <div className="merchant-profile">
          <div className="merchant-avatar-wrap">
            <div className="merchant-avatar-placeholder glass">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="merchant-avatar" />
              ) : (
                <ImageIcon size={40} className="text-muted" />
              )}
            </div>
            <div className="merchant-status-dot" />
          </div>
          <div className="merchant-info">
            <h2 className="title-md">{profileSettings.name || 'Merchant Partner'}</h2>
            <div className="merchant-meta-badges">
              <span className="badge-glass">ID: {user.id.slice(0, 8)}</span>
              <span className="badge-glass">Verified Seller</span>
            </div>
          </div>
        </div>
        <div className="merchant-actions">
          <button className="btn-outline" onClick={() => navigate(`/restaurant/${user.id}`)}>
             Storefront View <ArrowRight size={16} />
          </button>
          <button className="btn-primary" onClick={() => navigate('/')}>
             Customer Side
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar glass">
          <nav className="dashboard-nav">
            {[
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'media', icon: Film, label: 'Media' },
              { id: 'orders', icon: ShoppingCart, label: 'Live Orders' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`dash-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="dashboard-content glass">
          {activeTab === 'inventory' && (
            <div className="inventory-center">
              <div className="dash-section-header">
                <div>
                  <h3 className="title-sm">Menu Inventory</h3>
                  <p className="text-muted">Manage your active dishes and pricing</p>
                </div>
                {!isAddingItem ? (
                  <button className="btn-primary" onClick={() => setIsAddingItem(true)}>
                    <Plus size={18} /> Add New Item
                  </button>
                ) : (
                  <button className="btn-outline" onClick={() => setIsAddingItem(false)}>
                    <X size={18} /> Cancel
                  </button>
                )}
              </div>
              
              {isAddingItem ? (
                <form className="add-item-form glass slide-in" onSubmit={handleAddItemSubmit}>
                  <h4 style={{ marginBottom: '1.5rem' }}>Add New Delicacy</h4>
                  <div className="form-group">
                    <label>Food Name</label>
                    <input type="text" placeholder="e.g., Artisan Pizza" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Price (DZD)</label>
                      <input type="number" placeholder="Enter amount" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                    </div>
                    <div className="form-group flex-1">
                      <label>Category</label>
                      <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                        <option value="Pizza">Pizza</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Food Photo</label>
                    <div className="upload-btn-wrapper">
                      <button className="upload-btn glass">
                        {newItem.image ? 'Image Selected' : 'Upload Image'}
                      </button>
                      <input type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-100" disabled={isSaving}>
                    {isSaving ? 'Processing Delicacy...' : 'Save to Menu'}
                  </button>
                </form>
              ) : isLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin text-red" size={32} /></div>
              ) : inventory.length > 0 ? (
                <div className="inventory-list">
                  {inventory.map(item => (
                    <div key={item.id} className="inventory-item glass">
                      <img src={item.image_url} alt={item.name} className="inv-img" />
                      <div className="inv-details">
                        <h4>{item.name}</h4>
                        <span className="text-muted">{item.category} • {item.price} DZD</span>
                      </div>
                      <div className="inv-actions">
                        <button className="btn-icon delete-btn text-red" onClick={() => handleDeleteItem(item.id)} title="Delete"><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-dash-state">
                   <Package size={48} className="text-muted" />
                   <p>Your inventory is empty. Start adding dishes to go live!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-center">
              <h3 className="title-sm">Storefront Media</h3>
              <p className="text-muted">High-quality photos attract 40% more customers.</p>
              
              <div className="upload-zone slide-in" onClick={() => fileInputRef.current?.click()}>
                <Upload size={32} className="text-red" />
                <p>Click here to upload storefront imagery</p>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleMediaUpload} />
              </div>
              
              <div className="media-gallery">
                {mediaItems.map((url, idx) => (
                  <div key={idx} className="media-card glass">
                    <img src={url} alt={`Gallery item ${idx}`} />
                    <button className="media-del" onClick={() => {
                        const updated = mediaItems.filter((_, i) => i !== idx);
                        setMediaItems(updated);
                        localStorage.setItem(`merchant_media_${user.id}`, JSON.stringify(updated));
                        toast.success('Media removed');
                    }}>
                       <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-center">
              <h3 className="title-sm">Live Order Hub</h3>
              <p className="text-muted">Track and manage active customer requests in real-time.</p>
              <div className="orders-list" style={{ marginTop: '2rem' }}>
                {MOCK_ORDERS.map(order => (
                  <div key={order.id} className="order-row glass slide-in">
                    <div className="order-main">
                      <div className="order-id">{order.id}</div>
                      <div className="order-items">{order.items}</div>
                    </div>
                    <div className="order-meta text-right">
                       <div className="order-cust">{order.customer}</div>
                       <div className="order-price text-red">{order.total} DZD</div>
                    </div>
                    <div className={`order-status-badge ${order.status.toLowerCase()}`}>
                       {order.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-center">
              <h3 className="title-sm">Merchant Profile Settings</h3>
              <p className="text-muted">Public details that help customers find and connect with you.</p>
              
              <div className="settings-form slide-in">
                <div className="form-group">
                  <label>Public Restaurant Name</label>
                  <input 
                    type="text" 
                    value={profileSettings.name} 
                    onChange={e => setProfileSettings({...profileSettings, name: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={profileSettings.category} 
                    onChange={e => setProfileSettings({...profileSettings, category: e.target.value})}
                  >
                    <option value="Traditional">Traditional</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Address (City, Area)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Hydra, Algiers"
                    value={profileSettings.address} 
                    onChange={e => setProfileSettings({...profileSettings, address: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Business Number</label>
                  <input 
                    type="text" 
                    placeholder="+213..."
                    value={profileSettings.whatsapp} 
                    onChange={e => setProfileSettings({...profileSettings, whatsapp: e.target.value})} 
                  />
                </div>
                <button className="btn-primary" disabled={isSaving} onClick={saveProfile}>
                  {isSaving ? 'Syncing...' : 'Save & Deploy Settings'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Merchants;
