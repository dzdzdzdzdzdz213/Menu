import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { User, Phone, Calendar, Store, ShoppingBag } from 'lucide-react';

const ProfileSetup = () => {
  const { user, userProfile, fetchProfile } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    age: '',
    role: 'user',
    whatsapp: '',
    description: '',
    location: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        age: userProfile.age || '',
        role: userProfile.role || 'user',
        whatsapp: userProfile.whatsapp || '',
        description: userProfile.description || '',
        location: userProfile.location || ''
      });
      
      // If profile is already complete, redirect away
      if (userProfile.phone && userProfile.age && userProfile.role) {
        navigate('/account');
      }
    }
  }, [userProfile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name) return toast.error('Full name is required');
    if (!formData.phone || formData.phone.length < 9) return toast.error('Valid Algerian phone is required');
    if (!formData.age || formData.age < 13) return toast.error('You must be at least 13 years old');
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          age: parseInt(formData.age),
          role: formData.role,
          whatsapp: formData.whatsapp || formData.phone, // Default whatsapp to phone if empty
          description: formData.description,
          location: formData.location,
          is_active: true
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchProfile(user.id);
      toast.success('Profile completed!');
      navigate(formData.role === 'seller' ? '/seller-dashboard' : '/merchants');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '600px' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <h2 className="title-md" style={{ textAlign: 'center', marginBottom: '1rem' }}>Complete Your <span className="text-red">Profile</span></h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>We need a few more details to get you started.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} className="text-red" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="base-input" 
                placeholder="John Doe"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Algerian Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} className="text-red" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="base-input" 
                placeholder="05XXXXXXXX or 06XXXXXXXX"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Age (Min 13)</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} className="text-red" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" 
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                className="base-input" 
                placeholder="18"
                min="13"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', display: 'block' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`glass ${formData.role === 'user' ? 'active-tab' : ''}`}
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  border: formData.role === 'user' ? '2px solid var(--color-red)' : '1px solid var(--glass-border)',
                  background: formData.role === 'user' ? 'rgba(255,0,0,0.1)' : 'transparent'
                }}
              >
                <ShoppingBag size={24} className={formData.role === 'user' ? 'text-red' : 'text-muted'} />
                <span style={{ fontWeight: 600 }}>Buyer</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'seller'})}
                className={`glass ${formData.role === 'seller' ? 'active-tab' : ''}`}
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  border: formData.role === 'seller' ? '2px solid var(--color-red)' : '1px solid var(--glass-border)',
                  background: formData.role === 'seller' ? 'rgba(255,0,0,0.1)' : 'transparent'
                }}
              >
                <Store size={24} className={formData.role === 'seller' ? 'text-red' : 'text-muted'} />
                <span style={{ fontWeight: 600 }}>Seller</span>
              </button>
            </div>
          </div>

          {formData.role === 'seller' && (
            <div className="slide-in-top" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div className="form-group">
                <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Shop Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="base-input" 
                  placeholder="Tell us about your kitchen..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Location (City, Area)</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="base-input" 
                  placeholder="Hydra, Algiers"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ padding: '1.2rem', borderRadius: '14px', fontSize: '1.1rem', marginTop: '1rem' }}
          >
            {loading ? 'Saving...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
