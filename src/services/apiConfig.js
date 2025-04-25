const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-backend-url.up.railway.app/api'  // Update with your actual Railway backend URL
  : 'http://localhost:5001/api';

export default API_URL;