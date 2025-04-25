import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login', { state: { from: '/history' } });
          return;
        }
        
        const response = await fetch('http://localhost:5001/api/orders/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Orders fetched successfully:', data);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  return (
    <div className="history-container">
      <h2>Your Order History</h2>
      
      {loading ? (
        <div className="loading">Loading your orders...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button 
            className="browse-menu-btn" 
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                </span>
              </div>
              
              <div className="order-details">
                <p><strong>Total:</strong> ₹{parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                <p><strong>Payment Method:</strong> {order.payment_method}</p>
              </div>
              
              <button 
                className="view-details-btn"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;