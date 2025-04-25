const API_URL = 'http://localhost:5001/api';

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        localStorage.setItem('token', data.token);
        return data;
    },

    register: async (name, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
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