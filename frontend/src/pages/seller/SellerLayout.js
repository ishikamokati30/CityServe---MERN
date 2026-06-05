import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Package, Wrench, ShoppingBag } from 'lucide-react';
import './SellerLayout.css';

const navItems = [
  { to: '/seller', icon: <LayoutDashboard size={17}/>, label: 'Dashboard', end: true },
  { to: '/seller/shops', icon: <Store size={17}/>, label: 'My Shops' },
  { to: '/seller/products', icon: <Package size={17}/>, label: 'Products' },
  { to: '/seller/services', icon: <Wrench size={17}/>, label: 'Services' },
  { to: '/seller/orders', icon: <ShoppingBag size={17}/>, label: 'Orders' },
];

export default function SellerLayout({ children }) {
  return (
    <div className="seller-layout">
      <aside className="seller-sidebar">
        <div className="sidebar-brand">🏪 Seller Panel</div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="seller-main">{children}</main>
    </div>
  );
}
