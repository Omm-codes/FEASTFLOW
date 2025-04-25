import React, { useEffect, useState } from 'react';

const HistoryTest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing orders API...');
        const token = localStorage.getItem('token');
        
        // Use the CORRECT endpoint with /me
        const response = await fetch('http://localhost:5001/api/orders/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('API Response status:', response.status);
        const text = await response.text();
        console.log('API Response text:', text);
        
        try {
          const json = JSON.parse(text);
          console.log('Parsed JSON:', json);
          setResponse(json);
        } catch (e) {
          console.error('Failed to parse JSON:', e);
          setError('Invalid JSON response');
        }
      } catch (err) {
        console.error('API test error:', err);
        setError(err.message);
      }
    };
    
    testApi();
  }, []);
  
  return (
    <div style={{padding: '20px'}}>
      <h2>Testing Orders API</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {response ? (
        <div>
          <h3>Success! Orders found: {response.length}</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ) : !error ? (
        <div>Loading orders data...</div>
      ) : null}
    </div>
  );
};

export default HistoryTest;