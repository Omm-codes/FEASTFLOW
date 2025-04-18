import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        login({
          id: data.userId,
          email: data.email,
          role: data.role
        }, data.token);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  // ...rest of the component
};