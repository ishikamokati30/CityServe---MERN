import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Clock, MapPin } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import './ShopsPage.css';

const CATEGORIES = ['All', 'Grocery', 'Pharmacy', 'Bakery', 'Restaurant', 'Electronics', 'Clothing', 'Beauty', 'Hardware', 'Stationery', 'Other'];

export default function ShopsPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    Promise.all([
      API.get(`/shops?city=${cityId}`),
      API.get('/cities'),
    ]).then(([shopsRes, citiesRes]) => {
      setShops(shopsRes.data);
      setCity(citiesRes.data.find(c => c._id === cityId));
      setLoading(false);
    }).catch(() => { toast.error('Failed to load shops'); setLoading(false); });
  }, [cityId]);

  const filtered = shops.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || s.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="loading">Loading shops...</div>;

  return (
    <div className="page">
      <div className="container">
        <div className="shops-header">
          <div>
            <h1><MapPin size={20} /> Shops in {city?.name || 'City'}</h1>
            <p style={{ color: 'var(--muted)' }}>{shops.length} shops available</p>
          </div>
        </div>

        <div className="shops-filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="category-pills">
            {CATEGORIES.map(c => (
              <button key={c} className={`pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><h3>No shops found</h3><p>Try different search or category</p></div>
        ) : (
          <div className="grid-2">
            {filtered.map(shop => (
              <div key={shop._id} className="shop-card card" onClick={() => navigate(`/shop/${shop._id}`)}>
                <div className="shop-img">
                  {shop.image ? <img src={`http://localhost:5000${shop.image}`} alt={shop.name} /> : <div className="shop-img-placeholder">🏪</div>}
                  <span className={`open-badge ${shop.isOpen ? 'open' : 'closed'}`}>
                    <Clock size={12} /> {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="shop-info">
                  <div className="shop-cat badge badge-purple">{shop.category}</div>
                  <h3>{shop.name}</h3>
                  <p className="shop-addr"><MapPin size={13} /> {shop.address || 'See location in details'}</p>
                  <p className="shop-hours"><Clock size={13} /> {shop.openTime} – {shop.closeTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
