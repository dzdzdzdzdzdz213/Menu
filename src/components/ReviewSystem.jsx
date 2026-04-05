import React, { useState } from 'react';
import { Star, MessageSquare, Camera } from 'lucide-react';

const ReviewSystem = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    
    const submittedReview = {
      id: Date.now(),
      user: 'You',
      rating,
      text: newReview,
      date: new Date().toLocaleDateString()
    };
    
    setReviews([submittedReview, ...reviews]);
    setNewReview('');
  };

  return (
    <div className="review-system" style={{ padding: '1rem 0' }}>
      <div className="review-summary glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>{rating.toFixed(1)}</h2>
          <div style={{ display: 'flex', color: 'var(--color-red)', justifyContent: 'center', margin: '0.5rem 0' }}>
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill={i <= rating ? "currentColor" : "none"} />)}
          </div>
          <p className="text-muted">Based on {reviews.length} reviews</p>
        </div>
        
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '80px', fontSize: '0.9rem' }}>Food</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '95%', height: '100%', background: 'var(--color-red)' }}></div>
            </div>
            <span style={{ fontSize: '0.9rem' }}>4.9</span>
          </div>
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '80px', fontSize: '0.9rem' }}>Service</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--color-red)' }}></div>
            </div>
            <span style={{ fontSize: '0.9rem' }}>4.5</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '80px', fontSize: '0.9rem' }}>Vibe</span>
            <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '90%', height: '100%', background: 'var(--color-red)' }}></div>
            </div>
            <span style={{ fontSize: '0.9rem' }}>4.8</span>
          </div>
        </div>
      </div>

      <div className="write-review glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h3 className="title-sm" style={{ marginBottom: '1rem' }}>Share Your Experience</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button 
                key={i} 
                type="button" 
                onClick={() => setRating(i)}
                style={{ color: i <= rating ? 'var(--color-red)' : 'var(--glass-border)' }}
              >
                <Star fill={i <= rating ? "currentColor" : "none"} size={28} />
              </button>
            ))}
          </div>
          <textarea 
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="What did you love? How was the service?"
            style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', color: 'white', marginBottom: '1rem' }}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)' }}><Camera size={20} /></button>
            <button type="submit" className="btn-primary">Post Review</button>
          </div>
        </form>
      </div>

      <div className="reviews-list">
        <h3 className="title-sm" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} className="text-red" /> Community Talk
        </h3>
        {reviews.length > 0 ? reviews.map(r => (
          <div key={r.id} className="review-card glass" style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {r.user.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{r.user}</p>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>{r.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', color: 'var(--color-red)' }}>
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
            </div>
            <p style={{ lineHeight: 1.6 }}>{r.text}</p>
          </div>
        )) : (
          <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
