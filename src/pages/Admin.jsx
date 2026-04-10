import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Trash2, 
  BarChart3, 
  ShieldAlert,
  Loader2,
  Phone,
  Calendar,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const Admin = () => {
  const { user, userProfile } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      fetchAdminData();
    }
  }, [userProfile]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users & Sellers
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      setUsers(profiles || []);
      setMerchants(profiles?.filter(p => p.role === 'seller') || []);

      // 2. Fetch Analytics
      const { data: stats } = await supabase
        .from('analytics')
        .select(`
          *,
          profiles:seller_id (full_name)
        `)
        .order('created_at', { ascending: false });
      
      setAnalytics(stats || []);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This is irreversible.')) return;
    try {
      // Note: Real deletion usually happens via Supabase Auth Admin API, 
      // but here we mark as inactive OR delete from public.profiles.
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      toast.success('User deleted');
      fetchAdminData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getBestSellers = () => {
    const counts = {};
    analytics.forEach(a => {
      const name = a.profiles?.full_name || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getTrafficByHour = () => {
    const hours = Array(24).fill(0);
    analytics.forEach(a => {
      const hour = new Date(a.created_at).getHours();
      hours[hour]++;
    });
    return hours;
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <ShieldAlert size={64} className="text-red" style={{ marginBottom: '1rem' }} />
        <h2>Access Denied</h2>
        <p className="text-muted">You do not have administrative privileges.</p>
      </div>
    );
  }

  return (
    <div className="admin-page container" style={{ paddingTop: '8rem' }}>
      <div className="admin-header">
        <h2 className="title-lg">Site <span className="gradient-text">Administration</span></h2>
        <p className="text-muted">Total Control. Monitoring {users.length} users and {merchants.length} active sellers.</p>
      </div>

      <div className="profile-tabs glass" style={{ marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('overview')} className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}>Overview</button>
        <button onClick={() => setActiveTab('users')} className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}>User Management</button>
        <button onClick={() => setActiveTab('traffic')} className={`tab-btn ${activeTab === 'traffic' ? 'active' : ''}`}>Traffic Data</button>
      </div>

      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin text-red" size={48} /></div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="admin-grid">
              <div className="admin-card glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <TrendingUp className="text-red" />
                  <h3 className="title-sm">Platform Health</h3>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="stat-box glass" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{users.length}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Users</div>
                  </div>
                  <div className="stat-box glass" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{analytics.length}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Events</div>
                  </div>
                </div>
              </div>

              <div className="admin-card glass">
                <h3 className="title-sm">Top Performing Sellers</h3>
                <div style={{ marginTop: '1rem' }}>
                  {getBestSellers().map(([name, count], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                      <span>{name}</span>
                      <span className="text-red" style={{ fontWeight: 600 }}>{count} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-card glass">
              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="text" 
                    className="base-input" 
                    placeholder="Search users..." 
                    style={{ paddingLeft: '3rem' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="hours-table w-100">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                    <tr key={u.id}>
                      <td>{u.full_name}</td>
                      <td><span className={`badge-glass ${u.role}`} style={{ fontSize: '0.7rem' }}>{u.role.toUpperCase()}</span></td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red" 
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'traffic' && (
            <div className="admin-card glass">
              <h3 className="title-sm" style={{ marginBottom: '2rem' }}>Traffic Activity (Hourly)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', paddingBottom: '20px' }}>
                {getTrafficByHour().map((count, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      background: 'var(--color-red)', 
                      height: `${(count / (Math.max(...getTrafficByHour()) || 1)) * 100}%`,
                      borderRadius: '2px',
                      opacity: count > 0 ? 0.8 : 0.2
                    }}
                    title={`${i}:00 - ${count} hits`}
                  ></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>00:00</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>12:00</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>23:59</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
