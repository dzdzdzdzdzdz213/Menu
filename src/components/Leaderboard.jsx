import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Loader2, Award } from 'lucide-react';
import './Leaderboard.css';

const RANK_BADGE = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const { t, country } = useApp();
  const [activeCategory, setActiveCategory] = useState('Regular');
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const CATEGORIES = [
    { key: 'Regular', label: t.regular },
    { key: 'Traditional', label: t.traditional },
    { key: 'Patisserie', label: t.patisserie },
    { key: 'FastFood', label: t.fastfood },
    { key: 'Seafood', label: t.seafood },
    { key: 'Healthy', label: t.healthy },
  ];

  useEffect(() => {
    const fetchMerchants = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('merchants')
          .select('*')
          .eq('region', country)
          .order('rating', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        // Add rank locally for the top 100 view
        const rankedData = data.map((m, index) => ({
          ...m,
          rank: index + 1
        }));

        setMerchants(rankedData);
      } catch (err) {
        console.error('Leaderboard error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, [country, activeCategory]);

  return (
    <section className="leaderboard-section">
      <div className="leaderboard-header">
        <div>
          <h3 className="title-md">{t.leaderboardTitle} <span className="text-red">{t.leaderboardBadge}</span></h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {t.leaderboardSub} — <strong className="text-red">{country}</strong>
          </p>
        </div>
        <div className="leaderboard-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`lb-tab ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="leaderboard-table glass">
        <div className="lb-table-head">
          <span>{t.rank}</span>
          <span>{t.vendor}</span>
          <span>{t.region}</span>
          <span>{t.rating}</span>
          <span>{t.orders}</span>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin text-red" size={32} />
          </div>
        ) : merchants.length > 0 ? (
          merchants.map((entry) => (
            <div key={entry.id} className={`lb-row ${entry.rank <= 3 ? 'top-three' : ''}`}>
              <span className="lb-rank">
                {entry.rank <= 3 ? RANK_BADGE[entry.rank - 1] : `#${entry.rank}`}
              </span>
              <span className="lb-name">
                {entry.name}
                {entry.is_verified && <Award size={14} className="text-red" style={{ marginLeft: '6px', display: 'inline' }} />}
              </span>
              <span className="lb-region text-muted">{entry.city}</span>
              <span className="lb-rating"><span className="text-red">★</span> {entry.rating.toFixed(2)}</span>
              <span className="lb-orders text-muted">{entry.orders_count?.toLocaleString() || 0}</span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-muted">No merchants found in {country} for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
