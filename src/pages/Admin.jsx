import React, { useState, useEffect } from 'react';
import { Trash2, ImagePlus, Plus, Loader2, Clock, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import './Admin.css';

const Admin = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  const [businessHours, setBusinessHours] = useState(() => {
    const saved = localStorage.getItem('admin_business_hours');
    if (saved) return JSON.parse(saved);
    return {
      Monday: { open: '09:00', close: '22:00', closed: false },
      Tuesday: { open: '09:00', close: '22:00', closed: false },
      Wednesday: { open: '09:00', close: '22:00', closed: false },
      Thursday: { open: '09:00', close: '22:00', closed: false },
      Friday: { open: '14:00', close: '23:00', closed: false },
      Saturday: { open: '10:00', close: '23:00', closed: false },
      Sunday: { open: '10:00', close: '23:00', closed: false }
    };
  });

  const handleHoursChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const saveBusinessHours = () => {
    localStorage.setItem('admin_business_hours', JSON.stringify(businessHours));
    addToast('Business hours saved successfully!', 'success');
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from('products').select();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageBase64) {
      addToast('Please fill all required fields and upload an image', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await supabase.from('products').insert([{ 
        name, 
        price: Number(price), 
        category,
        specs: description,
        image_url: imageBase64 
      }]);
      addToast('Item added successfully!', 'success');
      setName('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImageBase64('');
      fetchProducts();
    } catch {
      addToast('Failed to add item. Maybe image is too large.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      addToast('Item deleted!', 'info');
      fetchProducts();
    } catch {
      addToast('Failed to delete item', 'error');
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h2 className="title-lg">Menu <span className="gradient-text">Dashboard</span></h2>
        <p className="text-muted">Easily add or remove items from your public menu.</p>
      </div>

      <div className="admin-grid">
        {/* ADD ITEM FORM */}
        <div className="admin-card glass">
          <h3 className="title-md" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Item</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Item Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Signature Burger" 
                className="base-input"
              />
            </div>
            <div className="form-group">
              <label>Price (DZD)</label>
              <input 
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g., 850" 
                className="base-input"
              />
            </div>
            <div className="form-group">
              <label>Item Category</label>
              <input 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g., Traditional Sweets" 
                list="category-suggestions"
                className="base-input"
              />
              <datalist id="category-suggestions">
                <option value="Sweets" />
                <option value="Traditional Sweets" />
                <option value="Pizza" />
                <option value="Sandwiches" />
                <option value="Drinks" />
                <option value="Fast Food" />
                <option value="Healthy" />
                <option value="Japanese" />
                <option value="Chinese" />
              </datalist>
            </div>
            <div className="form-group">
              <label>Item Description / Ingredients</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Made with organic tomatoes..." 
                className="base-input"
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label>Item Photo</label>
              <label className="image-upload-box clickable">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                {imageBase64 ? (
                  <img src={imageBase64} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder text-muted">
                    <ImagePlus size={32} style={{ marginBottom: 8 }} />
                    <p>Click to upload photo</p>
                  </div>
                )}
              </label>
            </div>
            <button type="submit" className="btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus size={18} style={{ marginRight: 8 }} /> Add Item</>}
            </button>
          </form>
        </div>

        {/* ITEMS LIST */}
        <div className="admin-card glass">
          <h3 className="title-md" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Menu ({products.length})</h3>
          
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin gradient-text" size={32} />
            </div>
          ) : (
            <div className="admin-items-list">
              {products.map(item => (
                <div key={item.id} className="admin-item">
                  <div className="admin-item-image-wrapper">
                    <img src={item.image_url} alt={item.name} className="admin-item-img" />
                    <button type="button" className="btn-icon delete-btn text-red" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="admin-item-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                       <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h4>
                       <span className="price text-red" style={{ fontWeight: 'bold' }}>{item.price} DZD</span>
                    </div>
                    {item.specs && <p className="admin-item-desc text-muted">{item.specs}</p>}
                    <div className="admin-item-meta" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      {item.category && <span className="cat-badge">{item.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No items in menu yet.</p>
              )}
            </div>
          )}
        </div>
        {/* BUSINESS HOURS SECTION */}
        <div className="admin-card glass" style={{ marginTop: '2rem', gridColumn: '1 / -1' }}>
          <div className="dash-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 className="title-md" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Clock className="text-red" /> Business Hours
              </h3>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>Set your weekly opening and closing schedules so customers know when to order.</p>
            </div>
            <button className="btn-primary" onClick={saveBusinessHours}>
              <Save size={16} style={{ marginRight: 8 }} /> Save Schedule
            </button>
          </div>
          
          <div className="hours-table-container">
            <table className="hours-table w-100">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Opening Time</th>
                  <th>Closing Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(businessHours).map(([day, schedule]) => (
                  <tr key={day} className={schedule.closed ? 'closed-day' : ''}>
                    <td className="day-name font-semibold">{day}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={!schedule.closed} 
                            onChange={(e) => handleHoursChange(day, 'closed', !e.target.checked)} 
                            hidden
                          />
                          <div className={`mock-toggle ${!schedule.closed ? 'active' : ''}`}></div>
                        </label>
                        <span className="status-text">{schedule.closed ? 'Closed' : 'Open'}</span>
                      </div>
                    </td>
                    <td>
                      <input 
                        type="time" 
                        value={schedule.open} 
                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)} 
                        disabled={schedule.closed}
                        className="base-input time-input"
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                      />
                    </td>
                    <td>
                      <input 
                        type="time" 
                        value={schedule.close} 
                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)} 
                        disabled={schedule.closed}
                        className="base-input time-input"
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
