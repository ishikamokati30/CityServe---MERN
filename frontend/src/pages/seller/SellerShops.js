import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Store } from 'lucide-react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function SellerShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/owner/shops').then(r => { setShops(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const deleteShop = async (id) => {
    if (!window.confirm('Delete this shop? All products/services will be removed.')) return;
    try { await API.delete(`/shops/${id}`); setShops(s => s.filter(x => x._id !== id)); toast.success('Shop deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <SellerLayout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <h1 className="section-title" style={{margin:0}}>My Shops</h1>
        <Link to="/seller/shops/new" className="btn btn-primary"><Plus size={16}/> New Shop</Link>
      </div>
      {loading ? <div className="loading">Loading...</div> : shops.length === 0 ? (
        <div className="empty"><Store size={48} style={{color:'var(--muted)',marginBottom:'1rem'}}/><h3>No shops yet</h3><p>Create your first shop to start selling</p><Link to="/seller/shops/new" className="btn btn-primary" style={{marginTop:'1rem'}}><Plus size={15}/> Create Shop</Link></div>
      ) : (
        <div className="grid-2">
          {shops.map(shop => (
            <div key={shop._id} className="card" style={{overflow:'hidden'}}>
              <div style={{height:'140px',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem'}}>
                {shop.image ? <img src={`http://localhost:5000${shop.image}`} alt={shop.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '🏪'}
              </div>
              <div style={{padding:'1.25rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <h3 style={{fontWeight:700,marginBottom:'0.25rem'}}>{shop.name}</h3>
                    <span className="badge badge-purple">{shop.category}</span>
                    {shop.city && <p style={{fontSize:'0.82rem',color:'var(--muted)',marginTop:'0.3rem'}}>{shop.city.name}, {shop.city.state}</p>}
                  </div>
                  <span className={`badge ${shop.isActive ? 'badge-green' : 'badge-red'}`}>{shop.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
                  <Link to={`/seller/shops/${shop._id}/edit`} className="btn btn-outline btn-sm"><Edit2 size={13}/> Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteShop(shop._id)}><Trash2 size={13}/> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
