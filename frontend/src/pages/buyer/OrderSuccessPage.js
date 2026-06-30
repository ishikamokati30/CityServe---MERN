import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  return (
    <div className="page">
      <div className="success-container">
        <div className="success-icon"><CheckCircle size={80} color="var(--success)" /></div>
        <h1>Order Placed!</h1>
        <p>Your order has been successfully placed. The seller will confirm it shortly.</p>
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            <Package size={16} /> View My Orders
          </Link>
          <Link to="/" className="btn btn-outline">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
