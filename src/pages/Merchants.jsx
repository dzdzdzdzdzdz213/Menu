import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Store, Star, ArrowRight, MapPin, Search } from 'lucide-react';
import { FoodCardSkeleton } from '../components/Skeletons';
import './Merchants.css';

const Merchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'seller')
          .eq('is_active', true);
        
        if (error) throw error;
        setMerchants(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="merchants-page container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 className="title-lg">Verified <span className="gradient-text">Partners</span></h2>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '1rem auto' }}>
          Explore the finest kitchens in the region. Each merchant is verified for quality and hygiene.
        </p>
        
        <div style={{ position: 'relative', maxWidth: '500px', margin: '2rem auto' }}>
          <Search size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="base-input" 
            style={{ paddingLeft: '3.5rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="merchants-grid">
          {[1,2,3,4].map(i => <div key={i} className="glass" style={{ height: '300px', borderRadius: '16px' }} />)}
        </div>
      ) : filteredMerchants.length > 0 ? (
        <div className="merchants-grid">
          {filteredMerchants.map(m => (
            <div
              key={m.id}
              className="merchant-showcase-card"
              onClick={() => navigate(`/restaurant/${m.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="merchant-card-img">
                <img src={m.hero_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"} alt={m.full_name} loading="lazy" />
                <div className="merchant-card-overlay" />
              </div>
              <div className="merchant-card-body">
                <div className="merchant-card-info">
                  <h3 className="merchant-card-name" style={{ color: 'white' }}>{m.full_name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <MapPin size={14} className="text-red" />
                    <span className="merchant-card-cat" style={{ fontSize: '0.8rem' }}>{m.location || 'Algeria'}</span>
                  </div>
                </div>
                <div className="merchant-card-rating">
                  <Star size={14} fill="var(--color-orange)" color="var(--color-orange)" />
                  4.8
                </div>
              </div>
              <div className="merchant-card-cta">
                View Menu <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Store size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
          <h3>No partners found</h3>
          <p className="text-muted">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default Merchants;
