import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

const CATEGORIES = ['Grocery','Pharmacy','Bakery','Restaurant','Electronics','Clothing','Beauty','Hardware','Stationery','Other'];

export default function ShopForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ name:'', city:'', category:'Grocery', contact:'', address:'', description:'', openTime:'09:00', closeTime:'21:00', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/cities').then(r => setCities(r.data));
    if (isEdit) API.get(`/shops/${id}`).then(r => {
      const s = r.data.shop;
      setForm({ name:s.name, city:s.city?._id||'', category:s.category, contact:s.contact, address:s.address||'', description:s.description||'', openTime:s.openTime||'09:00', closeTime:s.closeTime||'21:00', isActive:s.isActive });
    });
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await API.put(`/shops/${id}`, form);
      else await API.post('/shops', form);
      toast.success(isEdit ? 'Shop updated!' : 'Shop created!');
      navigate('/seller/shops');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <SellerLayout>
      <h1 className="section-title">{isEdit ? 'Edit Shop' : 'Create Shop'}</h1>
      <div className="card" style={{padding:'2rem',maxWidth:'600px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Shop Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
          <div className="form-group"><label>City *</label>
            <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} required>
              <option value="">Select city</option>
              {cities.map(c => <option key={c._id} value={c._id}>{c.name}, {c.state}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Contact Number *</label><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} required /></div>
          <div className="form-group"><label>Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div className="form-group"><label>Opens At</label><input type="time" value={form.openTime} onChange={e=>setForm({...form,openTime:e.target.value})} /></div>
            <div className="form-group"><label>Closes At</label><input type="time" value={form.closeTime} onChange={e=>setForm({...form,closeTime:e.target.value})} /></div>
          </div>
          <div className="form-group">
            <label style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
              <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} /> Shop is Active
            </label>
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Shop'}</button>
            <button type="button" className="btn btn-outline" onClick={()=>navigate('/seller/shops')}>Cancel</button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
