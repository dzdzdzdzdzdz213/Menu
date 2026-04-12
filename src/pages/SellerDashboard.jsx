import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { supabase } from '../lib/supabase';
import ImageUploader from '../components/ImageUploader';
import { 
  Store, 
  Plus, 
  Trash2, 
  BarChart3, 
  Settings, 
  LogOut, 
  Save,
  Loader2,
  MessageSquare,
  ImageOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const SellerDashboard = () => {
  const { user, userProfile, fetchProfile, signOut } = useApp();
  const [activeTab, setActiveTab] = useState('menu');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ visits: 0, clicks: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: '',
    specs: '',
    image_url: '',
  });

  const [profileData, setProfileData] = useState({
    full_name: '',
    description: '',
    location: '',
    whatsapp: '',
    hero_image_url: '',
    social_links: {}
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        description: userProfile.description || '',
        location: userProfile.location || '',
        whatsapp: userProfile.whatsapp || '',
        hero_image_url: userProfile.hero_image_url || '',
        social_links: userProfile.social_links || {}
      });
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      setProducts(prods || []);

      const { data: analytics } = await supabase
        .from('analytics')
        .select('event_type')
        .eq('seller_id', user.id);

      const visits = analytics?.filter(a => a.event_type === 'visit').length || 0;
      const clicks = analytics?.filter(a => a.event_type === 'whatsapp_click').length || 0;
      setStats({ visits, clicks });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Shop profile updated!');
      await fetchProfile(user.id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return toast.error('Name and price are required');

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([{ ...newItem, merchant_id: user.id }]);

      if (error) throw error;
      toast.success('Product added to menu!');
      setNewItem({ name: '', price: '', category: '', specs: '', image_url: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Remove this item from your menu?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Item removed');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('DANGER: This will deactivate your shop. Continue?')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Account deactivated');
      signOut();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-page container" style={{ paddingTop: '8rem' }}>
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Store className="text-red" size={32} />
          <h2 className="title-lg" style={{ margin: 0 }}>Seller <span className="gradient-text">Portal</span></h2>
        </div>
        <p className="text-muted">Manage your menu, track your traffic, and optimize your kitchen's digital presence.</p>
      </div>

      <div className="profile-tabs glass" style={{ marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('menu')} className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}>Menu</button>
        <button onClick={() => setActiveTab('profile')} className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}>Shop Setup</button>
        <button onClick={() => setActiveTab('stats')} className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}>Insights</button>
      </div>

      {/* ── MENU TAB ─────────────────────────────────────────── */}
      {activeTab === 'menu' && (
        <div className="admin-grid">
          {/* Add Product Form */}
          <div className="admin-card glass">
            <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>Add Product</h3>
            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  className="base-input"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Traditional Couscous"
                />
              </div>
              <div className="form-group">
                <label>Price (DZD)</label>
                <input
                  type="number"
                  className="base-input"
                  value={newItem.price}
                  onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="1200"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  className="base-input"
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Main Dish"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="base-input"
                  value={newItem.specs}
                  onChange={e => setNewItem({ ...newItem, specs: e.target.value })}
                  placeholder="Ingredients and details..."
                  rows="3"
                />
              </div>

              {/* ── Image Upload with compression ── */}
              <ImageUploader
                bucket="product-images"
                folder={user?.id || 'unknown'}
                currentUrl={newItem.image_url}
                onUpload={url => setNewItem({ ...newItem, image_url: url })}
                label="Product Photo (auto-compressed)"
                aspectRatio="4/3"
              />

              <button type="submit" className="btn-primary w-100" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus size={18} /> Add to Menu</>}
              </button>
            </form>
          </div>

          {/* Current Menu List */}
          <div className="admin-card glass">
            <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>Current Menu ({products.length})</h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin text-red" size={36} /></div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <ImageOff size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p>No items yet. Add your first product!</p>
              </div>
            ) : (
              <div className="admin-items-list">
                {products.map(item => (
                  <div key={item.id} className="admin-item">
                    {/* Image or placeholder icon */}
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        className="admin-item-img"
                        alt={item.name}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="admin-item-img" style={{ background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageOff size={24} className="text-muted" />
                      </div>
                    )}
                    <div className="admin-item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0 }}>{item.name}</h4>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="text-red"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                        {item.price} DZD {item.category && `· ${item.category}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE TAB ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="admin-card glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleUpdateProfile} className="admin-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="form-group">
                <label>Kitchen Name</label>
                <input
                  type="text"
                  className="base-input"
                  value={profileData.full_name}
                  onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  className="base-input"
                  value={profileData.whatsapp}
                  onChange={e => setProfileData({ ...profileData, whatsapp: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea
                  className="base-input"
                  value={profileData.description}
                  onChange={e => setProfileData({ ...profileData, description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Location (Area)</label>
                <input
                  type="text"
                  className="base-input"
                  value={profileData.location}
                  onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>

              {/* ── Cover / Hero image upload ── */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <ImageUploader
                  bucket="hero-images"
                  folder={user?.id || 'unknown'}
                  currentUrl={profileData.hero_image_url}
                  onUpload={url => setProfileData({ ...profileData, hero_image_url: url })}
                  label="Shop Cover Photo (auto-compressed to WebP)"
                  aspectRatio="16/5"
                />
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="text-red"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Deactivate Shop
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STATS TAB ────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="admin-card glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <BarChart3 size={48} className="text-red" style={{ marginBottom: '1rem' }} />
            <h4 className="title-lg">{stats.visits}</h4>
            <p className="text-muted">Total Page Visits</p>
          </div>
          <div className="admin-card glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <MessageSquare size={48} className="text-red" style={{ marginBottom: '1rem' }} />
            <h4 className="title-lg">{stats.clicks}</h4>
            <p className="text-muted">WhatsApp Order Clicks</p>
          </div>
          <div className="admin-card glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <h4 className="title-lg">
              {stats.visits > 0 ? ((stats.clicks / stats.visits) * 100).toFixed(1) : 0}%
            </h4>
            <p className="text-muted">Conversion Rate</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
