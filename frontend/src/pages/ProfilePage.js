import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Package, Store } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      await API.put('/auth/profile', payload);
      // Update localStorage name
      const stored = JSON.parse(localStorage.getItem('cityserve_user') || '{}');
      localStorage.setItem('cityserve_user', JSON.stringify({ ...stored, name: form.name }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar card">
            <div className="avatar-circle">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className={`badge ${user?.role === 'seller' ? 'badge-purple' : 'badge-blue'}`}>{user?.role}</span>
            <div className="profile-nav">
              {user?.role === 'buyer' ? (
                <Link to="/orders" className="profile-nav-link"><Package size={16} /> My Orders</Link>
              ) : (
                <Link to="/seller" className="profile-nav-link"><Store size={16} /> Seller Dashboard</Link>
              )}
            </div>
          </div>
          <div className="card profile-form-card">
            <h3><User size={18} /> Edit Profile</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label>Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label>Address</label>
                <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="form-group"><label>New Password <span style={{color:'var(--muted)',fontWeight:400}}>(leave blank to keep current)</span></label>
                <input type="password" placeholder="••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
