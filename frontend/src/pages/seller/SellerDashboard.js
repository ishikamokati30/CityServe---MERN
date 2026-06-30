import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, ShoppingBag, TrendingUp, Clock, Wrench } from 'lucide-react';
import API from '../../api/axios';
import SellerLayout from './SellerLayout';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/owner/dashboard').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: <Store size={24}/>, label: 'Shops', value: stats.shopCount, color: '#6c63ff', link: '/seller/shops' },
    { icon: <Package size={24}/>, label: 'Products', value: stats.productCount, color: '#10b981', link: '/seller/products' },
    { icon: <Wrench size={24}/>, label: 'Services', value: stats.serviceCount, color: '#f59e0b', link: '/seller/services' },
    { icon: <ShoppingBag size={24}/>, label: 'Total Orders', value: stats.orderCount, color: '#3b82f6', link: '/seller/orders' },
    { icon: <Clock size={24}/>, label: 'Pending Orders', value: stats.pendingOrders, color: '#ef4444', link: '/seller/orders' },
    { icon: <TrendingUp size={24}/>, label: 'Revenue', value: `₹${stats.totalRevenue}`, color: '#8b5cf6', link: '/seller/orders' },
  ] : [];

  return (
    <SellerLayout>
      <h1 className="section-title">Dashboard</h1>
      {loading ? <div className="loading">Loading...</div> : (
        <>
          <div className="stats-grid">
            {cards.map(card => (
              <Link to={card.link} key={card.label} className="stat-card card">
                <div className="stat-icon" style={{ background: card.color + '22', color: card.color }}>{card.icon}</div>
                <div className="stat-info">
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="dash-actions card">
            <h3>Quick Actions</h3>
            <div className="quick-links">
              <Link to="/seller/shops/new" className="btn btn-primary"><Store size={15}/> New Shop</Link>
              <Link to="/seller/products/new" className="btn btn-outline"><Package size={15}/> Add Product</Link>
              <Link to="/seller/services" className="btn btn-outline"><Wrench size={15}/> Add Service</Link>
              <Link to="/seller/orders" className="btn btn-outline"><ShoppingBag size={15}/> View Orders</Link>
            </div>
          </div>
        </>
      )}
    </SellerLayout>
  );
}
