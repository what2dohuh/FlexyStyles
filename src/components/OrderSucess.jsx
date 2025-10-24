import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/componentsStyles/OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        
        <p className="success-message">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="order-info">
          <p>You will receive an email confirmation shortly with your order details and tracking information.</p>
        </div>

        <div className="success-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/myaccount')}
          >
            View My Orders
          </button>
        </div>

        <div className="order-timeline">
          <h3>What happens next?</h3>
          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Order Confirmed</h4>
                <p>Your order has been received</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Processing</h4>
                <p>We're preparing your items</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Shipped</h4>
                <p>Your order is on its way</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Delivered</h4>
                <p>Enjoy your purchase!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;