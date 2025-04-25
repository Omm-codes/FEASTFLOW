import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from location state
  const { orderId, paymentReference, amount, paymentMethod } = location.state || {};
  
  // Generate receipt number
  const receiptNumber = `RCPT-${orderId}-${Date.now().toString().slice(-4)}`;
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handlePrint = () => {
    window.print();
  };
  
  const goToMenu = () => {
    navigate('/menu');
  };
  
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h2>Order Confirmed!</h2>
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>
        
        <div className="receipt">
          <div className="receipt-header">
            <h3>FeastFlow Receipt</h3>
            <p className="receipt-id">#{receiptNumber}</p>
          </div>
          
          <div className="receipt-details">
            <div className="receipt-row">
              <span>Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="receipt-row">
              <span>Date:</span>
              <span>{currentDate}</span>
            </div>
            <div className="receipt-row">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="receipt-row">
              <span>Payment Reference:</span>
              <span>{paymentReference}</span>
            </div>
            <div className="receipt-row total">
              <span>Total Amount:</span>
              <span>₹{amount}</span>
            </div>
          </div>
          
          <div className="receipt-message">
            <p>Thank you for your order! Your food is being prepared and will be ready shortly.</p>
          </div>
        </div>
        
        <div className="confirmation-actions">
          <button className="secondary-button" onClick={handlePrint}>
            Print Receipt
          </button>
          <button className="primary-button" onClick={goToMenu}>
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;