import { useEffect, useState } from 'react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function SellerCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountPercent: 20, minOrderAmount: 0, active: true, expiresAt: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/coupons')
      .then(r => setCoupons(r.data))
      .catch(() => toast.error('Failed to load coupons'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountPercent) return toast.error('Code and discount are required');
    setSaving(true);
    try {
      const res = await API.post('/coupons', form);
      setCoupons(prev => [res.data, ...prev]);
      setForm({ code: '', discountPercent: 20, minOrderAmount: 0, active: true, expiresAt: '' });
      toast.success('Coupon added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add coupon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Coupons</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Manage discount coupons for buyers.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.75rem', maxWidth: '720px', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Coupon Code *</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
            </div>
            <div className="form-group">
              <label>Discount (%) *</label>
              <input type="number" min="1" max="100" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Minimum Order Amount</label>
              <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Expires At</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Coupon'}</button>
        </form>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Coupon List</h2>
        {loading ? (
          <div className="loading">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="empty"><h3>No coupons yet</h3><p>Create coupons here to allow buyers to get discounts at checkout.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {coupons.map(coupon => (
              <div key={coupon._id} className="card" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <strong>{coupon.code}</strong>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {coupon.discountPercent}% off • min ₹{coupon.minOrderAmount}
                    {coupon.expiresAt ? ` • expires ${new Date(coupon.expiresAt).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <span className={`badge ${coupon.active ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.8rem' }}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
