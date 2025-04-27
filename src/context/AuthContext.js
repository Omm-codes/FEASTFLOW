import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authService as api } from '../services/api';

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,
  error: null,
};

// Add this function to decode the JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Update this function
const fetchUserData = async (token) => {
  if (!token) return null;
  
  try {
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

  // Load user data when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (authState.token && !authState.user) {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
          console.log('Attempting to fetch user data with token');
          // Try to fetch user data from backend
          const userData = await fetchUserData(authState.token);
          
          if (userData) {
            console.log('User data successfully fetched:', userData);
            dispatch({ type: 'USER_LOADED', payload: userData });
          } else {
            console.log('No user data returned, trying to parse JWT');
            // If backend request fails, try to extract basic info from token
            const tokenData = parseJwt(authState.token);
            if (tokenData) {
              console.log('JWT parsed successfully:', tokenData);
              const basicUserData = {
                id: tokenData.userId || tokenData.id || tokenData.sub,
                email: tokenData.email,
                role: tokenData.role,
                name: tokenData.name || (tokenData.email ? tokenData.email.split('@')[0] : 'User')
              };
              dispatch({ type: 'USER_LOADED', payload: basicUserData });
            } else {
              console.warn('Failed to parse JWT, logging out');
              // If all else fails, logout
              logout();
            }
          }
        } catch (error) {
          console.error('Error loading user:', error);
          logout();
        }
      }
    };
    
    loadUser();
  }, [authState.token]);

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