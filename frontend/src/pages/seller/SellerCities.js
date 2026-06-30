import { useEffect, useState } from 'react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function SellerCities() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ name: '', state: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/cities')
      .then(r => setCities(r.data))
      .catch(() => toast.error('Failed to load cities'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.state) return toast.error('Name and state are required');
    setSaving(true);
    try {
      const res = await API.post('/cities', form);
      setCities(prev => [res.data, ...prev]);
      setForm({ name: '', state: '' });
      toast.success('City added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add city');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Cities</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Add and view cities used by shops.</p>
        </div>
      </div>
      <div className="card" style={{ padding: '1.75rem', maxWidth: '680px', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label>City Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add City'}</button>
        </form>
      </div>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>City List</h2>
        {loading ? (
          <div className="loading">Loading cities...</div>
        ) : cities.length === 0 ? (
          <div className="empty"><h3>No cities yet</h3><p>Add city names and states here so sellers can select them when creating shops.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {cities.map(city => (
              <div key={city._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{city.name}</strong>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{city.state}</div>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>City</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
