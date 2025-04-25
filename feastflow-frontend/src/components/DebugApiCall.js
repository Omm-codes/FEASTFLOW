import React from 'react';

const DebugApiCall = () => {
  const testApiCall = async (endpoint) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Testing API call to: ${endpoint}`);
      console.log(`Using token: ${token ? 'Yes (length: ' + token.length + ')' : 'No'}`);
      
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      const text = await response.text();
      console.log('Response text:', text);
      
      try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', json);
        return json;
      } catch (e) {
        console.error('Not valid JSON:', e);
        return text;
      }
    } catch (error) {
      console.error('API call error:', error);
      return null;
    }
  };
  
  return (
    <div style={{padding: '20px', background: '#f5f5f5', border: '1px solid #ddd', margin: '20px'}}>
      <h3>API Debug Tool</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <button onClick={() => testApiCall('/api/orders/me')}>
          Test /api/orders/me
        </button>
        <button onClick={() => testApiCall('/api/debug/connection')}>
          Test /api/debug/connection
        </button>
        <button onClick={() => testApiCall('/api/orders/user')}>
          Test /api/orders/user
        </button>
        <button onClick={() => {
          const checkEndpoint = async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                console.error('No token available');
                return;
              }
              
              console.log('Testing API /api/orders/me...');
              const response = await fetch('http://localhost:5001/api/orders/me', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              console.log(`Response status: ${response.status} ${response.statusText}`);
              const text = await response.text();
              console.log('Response text:', text);
              
              if (response.ok) {
                alert('History API endpoint is working! Check console for details.');
              } else {
                alert(`Error: ${response.status} ${response.statusText}`);
              }
            } catch (error) {
              console.error('Error testing endpoint:', error);
              alert(`Failed to test endpoint: ${error.message}`);
            }
          };
          checkEndpoint();
        }}>
          Test History API Endpoint
        </button>
      </div>
    </div>
  );
};

export default DebugApiCall;