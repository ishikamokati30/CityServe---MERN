import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './OrderDetailPage.css';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_COLORS = {
  pending: 'badge-yellow', confirmed: 'badge-blue', preparing: 'badge-blue',
  out_for_delivery: 'badge-purple', delivered: 'badge-green', cancelled: 'badge-red',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await API.put(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order) return <div className="empty"><h3>Order not found</h3></div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page">
      <div className="container">
        <Link to="/orders" className="back-link"><ArrowLeft size={16} /> Back to Orders</Link>
        <div className="order-detail-header">
          <div>
            <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
            <p className="order-date-text">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
              {order.status.replace(/_/g, ' ')}
            </span>
            {!['delivered', 'cancelled'].includes(order.status) && (
              <button className="btn btn-danger btn-sm" onClick={cancelOrder} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        {order.status !== 'cancelled' && (
          <div className="card progress-card">
            <div className="progress-steps">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className={`progress-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
                  <div className="step-dot">{i < stepIndex ? '✓' : i + 1}</div>
                  <div className="step-label">{step.replace(/_/g, ' ')}</div>
                  {i < STATUS_STEPS.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-detail-grid">
          {/* Items */}
          <div className="card order-items-card">
            <h3><Package size={17} /> Items Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} className="od-item">
                <div className="od-item-img">
                  {item.image ? <img src={`http://localhost:5000${item.image}`} alt={item.name} /> : <span>📦</span>}
                </div>
                <div className="od-item-info">
                  <div className="od-item-name">{item.name}</div>
                  <div className="od-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="od-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="od-totals">
              <div className="od-total-row"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="od-total-row green"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
              <div className="od-total-row"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'Free' : `₹${order.deliveryCharge}`}</span></div>
              <div className="od-total-row bold"><span>Total</span><span>₹{order.total?.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card info-card">
              <h3><MapPin size={17} /> Delivery Info</h3>
              <p><strong>Type:</strong> {order.deliveryOption === 'home_delivery' ? '🏠 Home Delivery' : '🏪 Store Pickup'}</p>
              {order.deliveryAddress && <p><strong>Address:</strong> {order.deliveryAddress}</p>}
              {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
            </div>
            <div className="card info-card">
              <h3><CreditCard size={17} /> Payment</h3>
              <p><strong>Method:</strong> {order.paymentMode === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}</p>
              <p><strong>Status:</strong> <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : order.paymentStatus === 'failed' ? 'badge-red' : 'badge-yellow'}`}>{order.paymentStatus}</span></p>
            </div>
            {order.shop && (
              <div className="card info-card">
                <h3><Clock size={17} /> Shop</h3>
                <p><strong>Name:</strong> {order.shop.name}</p>
                {order.shop.contact && <p><strong>Contact:</strong> {order.shop.contact}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
