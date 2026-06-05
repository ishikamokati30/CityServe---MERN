import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Store, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          🏙️ <span>CityServe</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              {user.role === 'seller' ? (
                <Link to="/seller" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <Store size={16} /> Dashboard
                </Link>
              ) : (
                <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
                  <ShoppingCart size={16} />
                  Cart
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              )}
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                <User size={16} /> {user.name?.split(' ')[0]}
              </Link>
              <button className="nav-link btn-link" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
