import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Clock, Phone, MapPin, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import './ShopDetailPage.css';

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('products');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    API.get(`/shops/${shopId}`).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [shopId]);

  const handleAddToCart = (product) => {
    if (!user) return toast.error('Please login to add to cart');
    if (user.role === 'seller') return toast.error('Sellers cannot buy!');
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div className="loading">Loading shop...</div>;
  if (!data) return <div className="empty"><h3>Shop not found</h3></div>;

  const { shop, products, services } = data;

  return (
    <div className="page">
      <div className="container">
        {/* Shop Header */}
        <div className="shop-header card">
          <div className="shop-header-img">
            {shop.image ? <img src={`http://localhost:5000${shop.image}`} alt={shop.name} /> : <div className="sh-placeholder">🏪</div>}
          </div>
          <div className="shop-header-info">
            <div className="shop-header-top">
              <h1>{shop.name}</h1>
              <span className={`open-badge ${shop.isOpen ? 'open' : 'closed'}`}>
                <Clock size={14} /> {shop.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <p className="shop-cat badge badge-purple">{shop.category}</p>
            {shop.description && <p className="shop-desc">{shop.description}</p>}
            <div className="shop-meta">
              {shop.contact && <span><Phone size={14} /> {shop.contact}</span>}
              {shop.address && <span><MapPin size={14} /> {shop.address}</span>}
              <span><Clock size={14} /> {shop.openTime} – {shop.closeTime}</span>
              {shop.city && <span><MapPin size={14} /> {shop.city.name}, {shop.city.state}</span>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            🛍️ Products ({products.length})
          </button>
          <button className={`tab ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
            🔧 Services ({services.length})
          </button>
        </div>

        {tab === 'products' && (
          products.length === 0 ? (
            <div className="empty"><h3>No products available</h3></div>
          ) : (
            <div className="grid-3">
              {products.map(p => (
                <div key={p._id} className="product-card card">
                  <div className="product-img">
                    {p.image ? <img src={`http://localhost:5000${p.image}`} alt={p.name} /> : <div className="product-img-ph">📦</div>}
                    {p.discountPercent > 0 && <span className="discount-badge">{p.discountPercent}% OFF</span>}
                  </div>
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    {p.description && <p className="product-desc">{p.description}</p>}
                    <div className="product-price">
                      <span className="price-current">₹{p.discountedPrice}</span>
                      {p.discountPercent > 0 && <span className="price-original">₹{p.price}</span>}
                    </div>
                    <p className="stock-info" style={{ color: p.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </p>
                    <button className="btn btn-primary w-full" disabled={p.stock === 0}
                      onClick={() => handleAddToCart(p)}>
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'services' && (
          services.length === 0 ? (
            <div className="empty"><h3>No services available</h3></div>
          ) : (
            <div className="grid-2">
              {services.map(s => (
                <div key={s._id} className="service-card card">
                  <div className="service-info">
                    <h4>{s.name}</h4>
                    {s.description && <p>{s.description}</p>}
                    {s.duration && <p className="service-duration"><Clock size={13} /> {s.duration}</p>}
                  </div>
                  <div className="service-footer">
                    <span className="price-current">₹{s.price}</span>
                    {s.sameDayDelivery && (
                      <span className="badge badge-green"><Zap size={12} /> Same Day</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
