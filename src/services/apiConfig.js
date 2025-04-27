// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if it exists
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }
  
  // Make sure API_URL doesn't end with a slash
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  
  return `${baseUrl}/${endpoint}`;
};

// Helper function to make authenticated API requests
export const authRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found.');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  const options = {
    method,
    headers
  };
  
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(buildApiUrl(endpoint), options);
  
  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Token might be invalid - clear it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Your session has expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${response.statusText}`);
  }
  
  return response.json();
};

export default API_URL;