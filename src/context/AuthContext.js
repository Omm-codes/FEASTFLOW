import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authService as api } from '../services/api';

// Check for token in localStorage and verify if it's still valid
const checkToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Try to extract expiration from token
    const tokenData = parseJwt(token);
    // If token has expired or has no expiration, return false
    if (!tokenData || (tokenData.exp && Date.now() >= tokenData.exp * 1000)) {
      console.log('Token has expired, removing from localStorage');
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error checking token:', e);
    return false;
  }
};

// Improved initial state - sets isAuthenticated based on token presence and validity
const initialState = {
  isAuthenticated: checkToken(),
  token: localStorage.getItem('token') || null,
  user: null,
  loading: true, // Start with loading true to prevent flashes of unauthenticated content
  error: null,
};

// Add this function to decode the JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
};

// Improved function to fetch user data
const fetchUserData = async (token) => {
  if (!token) return null;
  
  try {
    console.log('Fetching user profile with token');
    const userData = await api.getUserProfile();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const AuthContext = createContext();

// Add the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: action.payload.token ? true : false,
        token: action.payload.token || null,
        loading: false,
        error: null,
      };
    case 'REGISTRATION_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        // Not authenticated yet as user needs to login
        isAuthenticated: false,
        token: null
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Add a debug log to track initialization
  useEffect(() => {
    console.log('AuthProvider initialized with state:', authState);
  }, []);

  // Load user data when component mounts or token changes
  useEffect(() => {
    const loadUser = async () => {
      const token = authState.token;
      
      if (!token) {
        // No token found, ensure we're marked as not authenticated and not loading
        dispatch({ type: 'LOGIN_FAILURE', payload: null });
        return;
      }
      
      // We have a token, so start the authentication process
      dispatch({ type: 'LOGIN_REQUEST' });
      
      try {
        console.log('Attempting to load user data from token');
        
        // First try to use the token to get user profile data from API
        const userData = await fetchUserData(token);
        
        if (userData) {
          console.log('User data successfully fetched from API:', userData);
          
          // Update authentication state with user data from API
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { token } 
          });
          dispatch({ type: 'USER_LOADED', payload: userData });
        } else {
          // API call failed, try to extract basic info from token
          console.log('API fetch failed, extracting data from JWT token');
          const tokenData = parseJwt(token);
          
          if (tokenData && (!tokenData.exp || Date.now() < tokenData.exp * 1000)) {
            console.log('JWT token is valid:', tokenData);
            
            // Create user object from token data
            const basicUserData = {
              id: tokenData.userId || tokenData.id || tokenData.sub,
              email: tokenData.email,
              role: tokenData.role,
              name: tokenData.name || (tokenData.email ? tokenData.email.split('@')[0] : 'User')
            };
            
            // Update authentication state with user data from token
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { token } 
            });
            dispatch({ type: 'USER_LOADED', payload: basicUserData });
          } else {
            console.warn('JWT token invalid or expired, logging out');
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        logout();
      }
    };
    
    loadUser();
  }, []);

  // Add isAdmin function to check if the current user has admin role
  const isAdmin = () => {
    // Check for admin token first
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      return true;
    }
    
    // Then check if user has admin role
    if (authState.user && authState.user.role) {
      return authState.user.role.toLowerCase() === 'admin';
    }
    
    // Check if isAdmin flag is set in localStorage
    const isAdminFlag = localStorage.getItem('isAdmin');
    if (isAdminFlag === 'true') {
      return true;
    }
    
    return false;
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      console.log('Attempting login with credentials');
      
      // Check if we have an API login function
      if (!api.login || typeof api.login !== 'function') {
        console.error('api.login is not a function:', api);
        throw new Error('Login API not properly configured');
      }
      
      const response = await api.login(credentials);
      console.log('Login response received:', response);
      
      // Extract token and other user data
      const token = response.token;
      const userData = {
        id: response.userId,
        email: response.email,
        name: response.name,
        role: response.role
      };
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token } });
      dispatch({ type: 'USER_LOADED', payload: userData });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle error messages
      let errorMessage = 'Login failed';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      console.log('Attempting registration with user data');
      // Make sure api.register exists and is a function
      if (!api.register || typeof api.register !== 'function') {
        console.error('api.register is not a function:', api);
        throw new Error('Registration API not properly configured');
      }
      
      const response = await api.register(userData);
      console.log('Registration response received:', response);
      
      // The backend returns { message: "User registered successfully" } without a token
      // This means registration succeeded but we need to redirect to login
      if (response && response.message && response.message.includes('registered successfully')) {
        // Registration was successful but doesn't log the user in automatically
        dispatch({ type: 'REGISTRATION_SUCCESS' });
        return true;
      } 
      // Keep checking for token in case the backend is updated in the future
      else if (response && response.token) {
        // Direct token in response
        const token = response.token;
        const user = response.user;
        
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token } });
        
        if (user) {
          dispatch({ type: 'USER_LOADED', payload: user });
        }
        
        return true;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection';
      } else if (error.message && error.message.includes('<!DOCTYPE')) {
        // Server returned HTML instead of JSON
        errorMessage = 'Server error: Received HTML instead of JSON response';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};