import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import API from '../../api/axios';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'badge-yellow', confirmed: 'badge-blue', preparing: 'badge-blue',
  out_for_delivery: 'badge-purple', delivered: 'badge-green', cancelled: 'badge-red',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title"><Package size={22} /> My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty">
            <Package size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <h3>No orders yet</h3>
            <p>When you place orders, they'll show up here</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link to={`/orders/${order._id}`} key={order._id} className="order-row card">
                <div className="order-row-left">
                  <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  {order.shop && <div className="order-shop">{order.shop.name}</div>}
                </div>
                <div className="order-row-mid">
                  <div className="order-items-preview">
                    {order.items.slice(0, 2).map((it, i) => (
                      <span key={i}>{it.name} ×{it.quantity}</span>
                    ))}
                    {order.items.length > 2 && <span>+{order.items.length - 2} more</span>}
                  </div>
                </div>
                <div className="order-row-right">
                  <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <div className="order-total">₹{order.total.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
