const API_URL = 'http://localhost:5001/api';

// Function to decode JWT tokens
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
};

export const authService = {
    login: async (credentials) => {
        try {
            console.log('API service: login called with', credentials);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API service: login error response', errorText);
                try {
                    // Try to parse as JSON
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Login failed');
                } catch (e) {
                    // If not JSON, throw with text
                    if (errorText.includes('<!DOCTYPE')) {
                        throw new Error('Server error: API returned HTML instead of JSON. Please check server configuration.');
                    }
                    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            console.log('API service: login response', data);
            return data;
        } catch (error) {
            console.error('API service: login error', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            console.log('API service: register called with', userData);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API service: register error response', errorText);
                try {
                    // Try to parse as JSON
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Registration failed');
                } catch (e) {
                    // If not JSON, throw with text
                    if (errorText.includes('<!DOCTYPE')) {
                        throw new Error('Server error: API returned HTML instead of JSON. Please check server configuration.');
                    }
                    throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            console.log('API service: register response', data);
            return data;
        } catch (error) {
            console.error('API service: register error', error);
            throw error;
        }
    },

    getUserProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            console.log('Fetching user profile with token');
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API service: getUserProfile error response', errorText);
                
                // Handle common error cases
                if (response.status === 401) {
                    throw new Error('Authentication expired. Please log in again.');
                } else if (response.status === 404) {
                    throw new Error('User profile not found');
                } else {
                    throw new Error(`Failed to get profile: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            console.log('API service: getUserProfile response', data);
            
            // If we have a valid response but no proper user data, extract from token
            if (!data || (!data.id && !data.userId)) {
                console.log('Profile response missing user ID, using JWT data');
                const tokenData = parseJwt(token);
                if (tokenData) {
                    return {
                        id: tokenData.userId || tokenData.id || tokenData.sub,
                        email: tokenData.email,
                        name: tokenData.name || tokenData.email?.split('@')[0] || 'User',
                        role: tokenData.role
                    };
                }
                throw new Error('Invalid user data in response');
            }
            
            return data;
        } catch (error) {
            console.error('API service: getUserProfile error', error);
            throw error;
        }
    }
};

export const menuService = {
    getMenuItems: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/menu`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    }
};

export const adminService = {
    updateMenuItem: async (id, data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update menu item');
        return response.json();
    },

    addMenuItem: async (data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/menu`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add menu item');
        return response.json();
    },

    deleteMenuItem: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/menu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete menu item');
        return response.json();
    }
};