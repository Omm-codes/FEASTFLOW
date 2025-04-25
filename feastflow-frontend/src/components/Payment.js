import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  // Get parameters from URL query
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || 'unknown';
  const totalAmount = params.get('amount') || 0;
  
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Generate unique payment reference
  const paymentReference = `PAY-${orderId}-${Date.now().toString().slice(-6)}`;
  
  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !isPaymentComplete) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isPaymentComplete]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Handle successful payment (simulated)
  const handlePaymentSuccess = () => {
    setIsPaymentComplete(true);
    
    // Clear the cart on successful payment
    clearCart();
    
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderId, 
          paymentReference, 
          amount: totalAmount,
          paymentMethod: 'UPI' 
        }
      });
    }, 2000);
  };
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this payment?')) {
      navigate('/menu');
    }
  };
  
  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Payment</h2>
        <div className="payment-details">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Amount:</strong> ₹{totalAmount}</p>
          <p><strong>Reference:</strong> {paymentReference}</p>
        </div>
        
        <div className="qr-container">
          {!isPaymentComplete ? (
            <>
              <p className="scan-text">Scan QR code with any UPI app to pay</p>
              <div className="qr-placeholder" style={{width: '200px', height: '200px', border: '1px solid #ddd', margin: '0 auto'}}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                  alt="QR Code Placeholder" 
                  style={{width: '100%', height: '100%'}}
                />
              </div>
              <p className="timer">Time remaining: {formatTime(countdown)}</p>
            </>
          ) : (
            <div className="payment-success">
              <div className="checkmark">✓</div>
              <p>Payment Successful!</p>
              <p>Redirecting to confirmation page...</p>
            </div>
          )}
        </div>
        
        <div className="payment-actions">
          <button 
            className="payment-button cancel-button" 
            onClick={handleCancel}
            disabled={isPaymentComplete}
          >
            Cancel
          </button>
          
          <button 
            className="payment-button success-button" 
            onClick={handlePaymentSuccess}
            disabled={isPaymentComplete}
          >
            Simulate Successful Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;