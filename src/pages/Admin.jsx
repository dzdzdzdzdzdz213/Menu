import React, { useState, useEffect } from 'react';
import { Trash2, ImagePlus, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import './Admin.css';

const Admin = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState('');

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
      addToast('Please fill all fields and upload an image', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await supabase.from('products').insert([{ 
        name, 
        price: Number(price), 
        image_url: imageBase64 
      }]);
      addToast('Item added successfully!', 'success');
      setName('');
      setPrice('');
      setImageBase64('');
      fetchProducts();
    } catch (err) {
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
    } catch (err) {
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
                  <img src={item.image_url} alt={item.name} className="admin-item-img" />
                  <div className="admin-item-info">
                    <h4>{item.name}</h4>
                    <span className="price">{item.price} DZD</span>
                  </div>
                  <button type="button" className="btn-icon text-red" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No items in menu yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
