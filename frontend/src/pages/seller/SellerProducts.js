import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

export default function SellerProducts() {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/owner/shops').then(r => { setShops(r.data); if(r.data[0]) setSelectedShop(r.data[0]._id); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!selectedShop) return;
    API.get(`/products?shop=${selectedShop}`).then(r => setProducts(r.data));
  }, [selectedShop]);

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <SellerLayout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <h1 className="section-title" style={{margin:0}}>Products</h1>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <select value={selectedShop} onChange={e=>setSelectedShop(e.target.value)} style={{padding:'0.5rem 0.9rem',borderRadius:'8px',border:'2px solid var(--border)'}}>
            {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <Link to={`/seller/products/new?shop=${selectedShop}`} className="btn btn-primary"><Plus size={15}/> Add Product</Link>
        </div>
      </div>
      {loading ? <div className="loading">Loading...</div> : products.length === 0 ? (
        <div className="empty"><Package size={48} style={{color:'var(--muted)',marginBottom:'1rem'}}/><h3>No products yet</h3><Link to={`/seller/products/new?shop=${selectedShop}`} className="btn btn-primary" style={{marginTop:'1rem'}}>Add First Product</Link></div>
      ) : (
        <div className="card" style={{overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#f9fafb',borderBottom:'2px solid var(--border)'}}>
              <th style={{padding:'0.9rem 1rem',textAlign:'left',fontSize:'0.85rem',fontWeight:700}}>Product</th>
              <th style={{padding:'0.9rem 1rem',textAlign:'left',fontSize:'0.85rem',fontWeight:700}}>Price</th>
              <th style={{padding:'0.9rem 1rem',textAlign:'left',fontSize:'0.85rem',fontWeight:700}}>Stock</th>
              <th style={{padding:'0.9rem 1rem',textAlign:'left',fontSize:'0.85rem',fontWeight:700}}>Status</th>
              <th style={{padding:'0.9rem 1rem',textAlign:'left',fontSize:'0.85rem',fontWeight:700}}>Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <div style={{width:'40px',height:'40px',borderRadius:'8px',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                        {p.image ? <img src={`http://localhost:5000${p.image}`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '📦'}
                      </div>
                      <div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:'0.78rem',color:'var(--muted)'}}>{p.category}</div></div>
                    </div>
                  </td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <div style={{fontWeight:700,color:'var(--primary)'}}>₹{p.discountedPrice}</div>
                    {p.discountPercent > 0 && <div style={{fontSize:'0.78rem',color:'var(--muted)',textDecoration:'line-through'}}>₹{p.price}</div>}
                  </td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <span style={{color: p.stock > 5 ? 'var(--success)' : p.stock > 0 ? 'var(--warning)' : 'var(--danger)',fontWeight:600}}>{p.stock}</span>
                  </td>
                  <td style={{padding:'0.9rem 1rem'}}><span className={`badge ${p.isAvailable ? 'badge-green' : 'badge-red'}`}>{p.isAvailable ? 'Available' : 'Hidden'}</span></td>
                  <td style={{padding:'0.9rem 1rem'}}>
                    <div style={{display:'flex',gap:'0.4rem'}}>
                      <Link to={`/seller/products/${p._id}/edit`} className="btn btn-outline btn-sm"><Edit2 size={13}/></Link>
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteProduct(p._id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  );
}
