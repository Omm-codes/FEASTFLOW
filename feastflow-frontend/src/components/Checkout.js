import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate total amount to ensure it's included
  const totalAmount = cart.reduce((total, item) => 
    total + (item.price * item.quantity), 0);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Your cart is empty!');
      navigate('/menu');
      return;
    }
    
    console.log("Form data:", formData);
    console.log("Cart data:", cart);
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Calculate total amount explicitly to ensure it's included
      const calculatedTotalAmount = cart.reduce((total, item) => 
        total + (item.price * item.quantity), 0);
      
      console.log("Calculated total amount:", calculatedTotalAmount);
      
      // Prepare order data with explicit values
      const orderData = {
        customer: {
          name: formData.name || "Guest",
          email: formData.email || "guest@example.com",
          phone: formData.phone || "1234567890",
          address: formData.address || "Not provided"
        },
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity || 1,
          price: parseFloat(item.price) || 0
        })),
        total_amount: calculatedTotalAmount || 0,
        payment_method: formData.paymentMethod || "cash"
      };
      
      console.log("Sending order data:", JSON.stringify(orderData));
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error("Failed to parse error response:", errorText);
          throw new Error(`Server error: ${response.status}`);
        }
        
        throw new Error(errorData.error || errorData.details || 'Failed to place order');
      }
      
      const result = await response.json();
      console.log('Order success, result:', result);

      // Redirect to payment page with order ID and amount
      window.location.href = `/payment?orderId=${result.id || ''}&amount=${calculatedTotalAmount}`;

    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if cart is empty cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);
  
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
          
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="total-amount">
          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
        </div>
      </div>
      
      <div className="checkout-form-container">
        <h3>Delivery Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
              
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Delivery Address*</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="place-order-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;