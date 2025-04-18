import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  Container,
  CircularProgress
} from '@mui/material';

const Dashboard = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard mounted, user:', user); // Debug log
    
    if (user) {
      console.log('User role:', user.role); // Debug log
      if (user.role === 'admin') {
        fetchMenuItems();
      } else {
        setError('Access denied. Admin privileges required.');
      }
    }
    setLoading(false);
  }, [user]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      const url = editItem 
        ? `http://localhost:5001/api/admin/menu/${editItem.id}`
        : 'http://localhost:5001/api/admin/menu';
      
      const response = await fetch(url, {
        method: editItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save item');
      }

      setModalOpen(false);
      setEditItem(null);
      setFormData({ name: '', description: '', price: '', image: null });
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert(error.message);
    }
  };

  const handleEdit = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      fetchMenuItems(); // Refresh the list
      setModalOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/admin/menu/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete item');
        }

        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert(error.message);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error || !user || user.role !== 'admin') {
    return (
      <Layout>
        <Container>
          <Box textAlign="center" py={4}>
            <Typography variant="h5" color="error">
              {error || 'Access Denied. Admin privileges required.'}
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4">Menu Management</Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setEditItem(null);
              setFormData({ name: '', description: '', price: '', image: null });
              setModalOpen(true);
            }}
          >
            Add New Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setEditItem(item);
                        setFormData({
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          image: null
                        });
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" mb={2}>
              {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                margin="normal"
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                style={{ marginTop: 16, marginBottom: 16 }}
              />
              <Box mt={2}>
                <Button type="submit" variant="contained">
                  {editItem ? 'Update' : 'Add'}
                </Button>
                <Button onClick={() => setModalOpen(false)} sx={{ ml: 1 }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Dashboard;