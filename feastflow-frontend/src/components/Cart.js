import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Handle checkout button click with debug logs
  const handleCheckout = () => {
    console.log('Checkout button clicked');
    
    if (cart.length === 0) {
      console.log('Cart is empty, not proceeding');
      return;
    }
    
    console.log('Navigating to /checkout');
    navigate('/checkout');
    
    // Debug - check if navigation happened
    setTimeout(() => {
      console.log('Current location:', window.location.pathname);
    }, 100);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/menu')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image_url} alt={item.name} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                </div>
                <div className="item-total">
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="total">
              <h3>Total Amount:</h3>
              <h3>₹{totalAmount.toFixed(2)}</h3>
            </div>
            <div className="checkout-controls">
              <button 
                onClick={() => navigate('/menu')}
                className="continue-shopping"
              >
                Continue Shopping
              </button>
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                type="button"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
          
          {/* Debug section */}
          <div style={{marginTop: "20px", fontSize: "12px", color: "#666"}}>
            <p>Debug - Direct links:</p>
            <a 
              href="/checkout" 
              style={{color: "blue", display: "block", marginBottom: "5px"}}
            >
              Direct Link to Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;