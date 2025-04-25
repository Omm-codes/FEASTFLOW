import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  
  if (!orderId) {
    // If no orderId is found in state, redirect to home
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    
    return null;
  }
  
  return (
    <div className="order-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Your order has been successfully placed.</p>
        <p className="order-id">Order ID: #{orderId}</p>
        
        <div className="order-details">
          <p>We've received your order and will begin preparing it shortly.</p>
          <p>You will receive updates about your order via email.</p>
        </div>
        
        <div className="confirmation-actions">
          <button onClick={() => navigate('/menu')} className="back-to-menu">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;