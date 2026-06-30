import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const preselectedShop = new URLSearchParams(location.search).get('shop') || '';
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ shop: preselectedShop, name:'', description:'', price:'', discountPercent:0, stock:'', category:'', isAvailable:true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/owner/shops').then(r => setShops(r.data));
    if (isEdit) API.get(`/products/${id}`).then(r => {
      const p = r.data;
      setForm({ shop: p.shop?._id||p.shop||'', name:p.name, description:p.description||'', price:p.price, discountPercent:p.discountPercent||0, stock:p.stock, category:p.category||'', isAvailable:p.isAvailable });
      if (p.image) setPreview(`http://localhost:5000${p.image}`);
    });
  }, [id, isEdit]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (isEdit) await API.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/seller/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <SellerLayout>
      <h1 className="section-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <div className="card" style={{padding:'2rem',maxWidth:'600px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Shop *</label>
            <select value={form.shop} onChange={e=>setForm({...form,shop:e.target.value})} required>
              <option value="">Select shop</option>
              {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
          <div className="form-group"><label>Category</label><input placeholder="e.g. Beverages" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
            <div className="form-group"><label>Price (₹) *</label><input type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
            <div className="form-group"><label>Discount %</label><input type="number" min="0" max="100" value={form.discountPercent} onChange={e=>setForm({...form,discountPercent:e.target.value})} /></div>
            <div className="form-group"><label>Stock *</label><input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} required /></div>
          </div>
          <div className="form-group"><label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImage} />
            {preview && <img src={preview} alt="preview" style={{width:'100%',maxHeight:'160px',objectFit:'cover',borderRadius:'8px',marginTop:'0.5rem'}} />}
          </div>
          <div className="form-group">
            <label style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
              <input type="checkbox" checked={form.isAvailable} onChange={e=>setForm({...form,isAvailable:e.target.checked})} /> Available for purchase
            </label>
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Product'}</button>
            <button type="button" className="btn btn-outline" onClick={()=>navigate('/seller/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
