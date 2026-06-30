import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', preparing:'badge-blue', out_for_delivery:'badge-purple', delivered:'badge-green', cancelled:'badge-red' };

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/owner/orders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await API.put(`/owner/orders/${orderId}/status`, { status });
      setOrders(o => o.map(x => x._id === orderId ? data : x));
      toast.success(`Order marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <SellerLayout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <h1 className="section-title" style={{margin:0}}>Orders</h1>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'0.5rem 0.9rem',borderRadius:'8px',border:'2px solid var(--border)'}}>
          <option value="all">All Orders</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">Loading...</div> : filtered.length === 0 ? (
        <div className="empty"><ShoppingBag size={48} style={{color:'var(--muted)',marginBottom:'1rem'}}/><h3>No orders found</h3></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {filtered.map(order => (
            <div key={order._id} className="card" style={{padding:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'0.75rem',marginBottom:'0.75rem'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:'1rem'}}>Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--muted)'}}>{new Date(order.createdAt).toLocaleString('en-IN')}</div>
                  {order.user && <div style={{fontSize:'0.85rem',marginTop:'0.2rem'}}><strong>{order.user.name}</strong> · {order.user.email} {order.user.phone && `· ${order.user.phone}`}</div>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                  <span className={`badge ${STATUS_COLORS[order.status]||'badge-gray'}`} style={{fontSize:'0.82rem',padding:'0.35rem 0.8rem'}}>
                    {order.status.replace(/_/g,' ')}
                  </span>
                  <div style={{position:'relative'}}>
                    <select value={order.status} onChange={e=>updateStatus(order._id, e.target.value)}
                      style={{padding:'0.4rem 2rem 0.4rem 0.8rem',borderRadius:'8px',border:'2px solid var(--border)',fontSize:'0.85rem',appearance:'none',cursor:'pointer',background:'#fff'}}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                    <ChevronDown size={14} style={{position:'absolute',right:'0.5rem',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--muted)'}} />
                  </div>
                </div>
              </div>

              <div style={{borderTop:'1px solid var(--border)',paddingTop:'0.75rem'}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'0.75rem'}}>
                  {order.items.map((item,i) => (
                    <span key={i} style={{fontSize:'0.82rem',background:'#f3f4f6',padding:'0.2rem 0.6rem',borderRadius:'6px'}}>
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
                <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',fontSize:'0.85rem',color:'var(--muted)'}}>
                  <span><strong style={{color:'var(--text)'}}>₹{order.total?.toFixed(2)}</strong></span>
                  <span>{order.deliveryOption === 'home_delivery' ? '🏠 Home Delivery' : '🏪 Pickup'}</span>
                  <span>{order.paymentMode === 'cod' ? '💵 COD' : '💳 Online'} · <span className={`badge ${order.paymentStatus==='paid'?'badge-green':order.paymentStatus==='failed'?'badge-red':'badge-yellow'}`}>{order.paymentStatus}</span></span>
                  {order.deliveryAddress && <span>📍 {order.deliveryAddress}</span>}
                </div>
                {order.notes && <p style={{marginTop:'0.4rem',fontSize:'0.82rem',color:'var(--muted)'}}>📝 {order.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
