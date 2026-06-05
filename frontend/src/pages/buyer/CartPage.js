import './CartPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const navigate = useNavigate();

  const deliveryCharge = cartTotal > 0 && cartTotal < 500 ? 50 : 0;
  const total = cartTotal - discount + deliveryCharge;

  const applyCoupon = async () => {
    try {
      const { data } = await API.post('/cart/apply-coupon', { code: coupon, subtotal: cartTotal });
      setDiscount(data.discount);
      setCouponApplied(data.code);
      toast.success(`Coupon applied! ₹${data.discount} off`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  if (cart.length === 0) return (
    <div className="page">
      <div className="container empty">
        <ShoppingBag size={60} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
        <h3>Your cart is empty</h3>
        <p>Browse shops and add items to your cart</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Shops</Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item card">
                <div className="cart-item-img">
                  {item.image ? <img src={`http://localhost:5000${item.image}`} alt={item.name} /> : <span>📦</span>}
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  {item.shop?.name && <p className="cart-shop">{item.shop.name}</p>}
                  <div className="price-row">
                    <span className="price-current">₹{item.discountedPrice || item.price}</span>
                    {item.discountPercent > 0 && <span className="price-original">₹{item.price}</span>}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <span className="item-total">₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.productId)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="summary-row green"><span>Coupon ({couponApplied})</span><span>-₹{discount.toFixed(2)}</span></div>}
            <div className="summary-row"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span></div>
            {deliveryCharge > 0 && <p className="free-del-hint">Add ₹{(500 - cartTotal).toFixed(0)} more for free delivery</p>}
            <hr />
            <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

            <div className="coupon-input">
              <input placeholder="Enter coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} />
              <button className="btn btn-outline btn-sm" onClick={applyCoupon}>Apply</button>
            </div>

            <button className="btn btn-primary w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// CSS import added below
