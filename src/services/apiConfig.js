const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-backend-url.up.railway.app/api'  // Update with your actual Railway backend URL
  : 'http://localhost:5001/api';

// Export both the full API URL and a function to build endpoint URLs
export const buildApiUrl = (endpoint) => `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

export default API_URL;