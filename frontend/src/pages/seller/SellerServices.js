import { useEffect, useState } from 'react';
import { Wrench, Plus, Trash2, Edit2 } from 'lucide-react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function SellerServices() {
  const [shops, setShops] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', price:'', duration:'', sameDayDelivery:false, isAvailable:true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/owner/shops').then(r => { setShops(r.data); if(r.data[0]) setSelectedShop(r.data[0]._id); });
  }, []);

  useEffect(() => {
    if (!selectedShop) return;
    API.get(`/services?shop=${selectedShop}`).then(r => setServices(r.data));
  }, [selectedShop]);

  const resetForm = () => { setForm({ name:'', description:'', price:'', duration:'', sameDayDelivery:false, isAvailable:true }); setEditItem(null); setShowForm(false); };

  const startEdit = (s) => { setForm({ name:s.name, description:s.description||'', price:s.price, duration:s.duration||'', sameDayDelivery:s.sameDayDelivery, isAvailable:s.isAvailable }); setEditItem(s._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editItem) { const { data } = await API.put(`/services/${editItem}`, form); setServices(s => s.map(x => x._id===editItem ? data : x)); toast.success('Updated!'); }
      else { const { data } = await API.post('/services', { ...form, shop: selectedShop }); setServices(s => [...s, data]); toast.success('Service added!'); }
      resetForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await API.delete(`/services/${id}`); setServices(s => s.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <SellerLayout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <h1 className="section-title" style={{margin:0}}>Services</h1>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <select value={selectedShop} onChange={e=>setSelectedShop(e.target.value)} style={{padding:'0.5rem 0.9rem',borderRadius:'8px',border:'2px solid var(--border)'}}>
            {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}><Plus size={15}/> Add Service</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{padding:'1.5rem',marginBottom:'1.5rem',maxWidth:'560px'}}>
          <h3 style={{fontWeight:700,marginBottom:'1rem'}}>{editItem?'Edit Service':'New Service'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Service Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group"><label>Price (₹) *</label><input type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
              <div className="form-group"><label>Duration</label><input placeholder="e.g. 2 hours" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} /></div>
            </div>
            <div style={{display:'flex',gap:'1.5rem',marginBottom:'1rem'}}>
              <label style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer'}}><input type="checkbox" checked={form.sameDayDelivery} onChange={e=>setForm({...form,sameDayDelivery:e.target.checked})} /> Same-day delivery</label>
              <label style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer'}}><input type="checkbox" checked={form.isAvailable} onChange={e=>setForm({...form,isAvailable:e.target.checked})} /> Available</label>
            </div>
            <div style={{display:'flex',gap:'0.75rem'}}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save'}</button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {services.length === 0 ? (
        <div className="empty"><Wrench size={48} style={{color:'var(--muted)',marginBottom:'1rem'}}/><h3>No services yet</h3></div>
      ) : (
        <div className="grid-2">
          {services.map(s => (
            <div key={s._id} className="card" style={{padding:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <h3 style={{fontWeight:700,marginBottom:'0.25rem'}}>{s.name}</h3>
                  {s.description && <p style={{fontSize:'0.85rem',color:'var(--muted)',marginBottom:'0.5rem'}}>{s.description}</p>}
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    <span style={{fontWeight:800,color:'var(--primary)'}}>₹{s.price}</span>
                    {s.duration && <span className="badge badge-gray">{s.duration}</span>}
                    {s.sameDayDelivery && <span className="badge badge-green">⚡ Same Day</span>}
                    <span className={`badge ${s.isAvailable ? 'badge-blue' : 'badge-red'}`}>{s.isAvailable ? 'Available' : 'Hidden'}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.4rem',flexShrink:0,marginLeft:'0.75rem'}}>
                  <button className="btn btn-outline btn-sm" onClick={()=>startEdit(s)}><Edit2 size={13}/></button>
                  <button className="btn btn-danger btn-sm" onClick={()=>deleteService(s._id)}><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
