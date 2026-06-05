import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import API from '../api/axios';
import './HomePage.css';

export default function HomePage() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/cities').then(r => { setCities(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Local Shops, <span className="gradient-text">Delivered to You</span></h1>
          <p>Discover shops, services & products from your city. Support local businesses!</p>
          <div className="hero-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search your city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="hero-illustration">🏙️</div>
      </section>

      {/* Cities */}
      <section className="cities-section container">
        <h2 className="section-title">
          <MapPin size={22} style={{ color: 'var(--primary)' }} /> Choose Your City
        </h2>
        {loading ? (
          <div className="loading">Loading cities...</div>
        ) : filtered.length === 0 ? (
          <div className="empty"><h3>No cities found</h3></div>
        ) : (
          <div className="cities-grid">
            {filtered.map(city => (
              <div key={city._id} className="city-card card" onClick={() => navigate(`/shops/${city._id}`)}>
                <div className="city-icon">🏙️</div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>{city.state}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why CityServe?</h2>
          <div className="features-grid">
            {[
              { icon: '🛒', title: 'Shop Locally', desc: 'Browse products from shops in your city' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day delivery from local sellers' },
              { icon: '💼', title: 'Sell Easily', desc: 'Register as a seller and grow your business' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Multiple payment options, fully secure' },
            ].map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
