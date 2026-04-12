import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const BookingEngine = ({ merchantId, whatsapp, merchantName }) => {
  const { user, userProfile } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!merchantId) {
      toast.error('Merchant ID missing. Cannot book.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        merchant_id: merchantId,
        user_id: user?.id || null,
        user_name: userProfile?.full_name || 'Guest',
        user_phone: userProfile?.phone || '',
        date,
        time,
        guests: parseInt(guests) || 2,
        status: 'pending',
      });

      if (error) throw error;
      
      setIsBooked(true);

      if (whatsapp) {
        const message = encodeURIComponent(`Hi ${merchantName}, I'd like to book a table for ${guests} on ${date} at ${time}.`);
        window.open(`https://wa.me/${whatsapp.replace(/\+/g, '')}?text=${message}`, '_blank');
      } else {
        toast.success("Booking saved, but the merchant doesn't have a WhatsApp number.");
      }

    } catch (err) {
      toast.error(err.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-engine glass" style={{ padding: '2rem', borderRadius: '16px' }}>
      <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>Reserve Your Table</h3>
      {isBooked ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 255, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <span style={{ color: '#4ade80', fontSize: '2rem' }}>✓</span>
          </div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Reservation Confirmed!</h4>
          <p className="text-muted">You have requested a table for {guests} on {date} at {time}.</p>
        </div>
      ) : (
        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
              />
              <Calendar size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Time</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
                />
                <Clock size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Guests</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', appearance: 'none' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num} style={{ background: 'var(--color-bg)' }}>{num} People</option>
                  ))}
                  <option value="9" style={{ background: 'var(--color-bg)' }}>9+ People</option>
                </select>
                <Users size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.25rem' }}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Book Experience</>}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingEngine;
