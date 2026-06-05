import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ deliveryOption: 'home_delivery', deliveryAddress: '', paymentMode: 'cod', notes: '' });
  const [discount] = useState(0);
  const [loading, setLoading] = useState(false);

  const deliveryCharge = cartTotal > 0 && cartTotal < 500 ? 50 : 0;
  const total = cartTotal - discount + deliveryCharge;

  if (cart.length === 0) { navigate('/cart'); return null; }

  const handleOrder = async () => {
    if (form.deliveryOption === 'home_delivery' && !form.deliveryAddress.trim()) {
      return toast.error('Please enter delivery address');
    }
    setLoading(true);
    try {
      const items = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));
      await API.post('/orders', {
        items,
        deliveryOption: form.deliveryOption,
        deliveryAddress: form.deliveryAddress,
        paymentMode: form.paymentMode,
        subtotal: cartTotal,
        discount,
        deliveryCharge,
        total,
        notes: form.notes,
      });
      clearCart();
      navigate('/order-success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-forms">
            {/* Delivery */}
            <div className="checkout-section card">
              <h3><Truck size={18} /> Delivery Option</h3>
              <div className="option-group">
                {[
                  { value: 'home_delivery', label: '🏠 Home Delivery', desc: `${deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}` },
                  { value: 'pickup', label: '🏪 Store Pickup', desc: 'Free' },
                ].map(o => (
                  <label key={o.value} className={`option-card ${form.deliveryOption === o.value ? 'active' : ''}`}>
                    <input type="radio" name="delivery" value={o.value} checked={form.deliveryOption === o.value}
                      onChange={e => setForm({ ...form, deliveryOption: e.target.value })} />
                    <div>
                      <span className="opt-label">{o.label}</span>
                      <span className="opt-desc">{o.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              {form.deliveryOption === 'home_delivery' && (
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label><MapPin size={14} /> Delivery Address</label>
                  <textarea placeholder="Enter your full delivery address..."
                    value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} />
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="checkout-section card">
              <h3><CreditCard size={18} /> Payment Method</h3>
              <div className="option-group">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when delivered' },
                  { value: 'online', label: '💳 Online Payment', desc: 'UPI / Card / Net Banking (Razorpay)' },
                ].map(o => (
                  <label key={o.value} className={`option-card ${form.paymentMode === o.value ? 'active' : ''}`}>
                    <input type="radio" name="payment" value={o.value} checked={form.paymentMode === o.value}
                      onChange={e => setForm({ ...form, paymentMode: e.target.value })} />
                    <div>
                      <span className="opt-label">{o.label}</span>
                      <span className="opt-desc">{o.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              {form.paymentMode === 'online' && (
                <div className="razorpay-note">
                  <CheckCircle size={16} color="var(--success)" />
                  <span>Razorpay integration ready — add your API keys in <code>.env</code> to enable live payments.</span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="checkout-section card">
              <h3>Order Notes (optional)</h3>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea placeholder="Any special instructions for the seller..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-summary">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
              <div className="order-items-list">
                {cart.map(item => (
                  <div key={item.productId} className="order-item-row">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr style={{ margin: '0.75rem 0', borderColor: 'var(--border)' }} />
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row green"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="summary-row"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span></div>
              <hr style={{ margin: '0.75rem 0', borderColor: 'var(--border)' }} />
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <button className="btn btn-primary w-full" onClick={handleOrder} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
