import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Restaurant as RestaurantIcon,
  VisibilityOff,
  Visibility,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingStoreSettings, setSavingStoreSettings] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Restaurant settings
  const [storeSettings, setStoreSettings] = useState({
    name: 'FeastFlow Restaurant',
    address: '123 Food Street, Flavor Town',
    phone: '+91 9876543210',
    email: 'contact@feastflow.com',
    openingHours: '10:00 AM - 10:00 PM',
    taxPercentage: '5',
    deliveryFee: '40',
    minOrderAmount: '100',
    allowGuestCheckout: true,
    enableOnlinePayments: true,
    enableSMS: false,
    logoUrl: '',
    welcomeMessage: 'Welcome to FeastFlow! Enjoy our delicious meals.'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    marketingEmails: false,
    orderSMS: true,
    lowStockAlerts: true
  });
  
  // Admin account management
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@feastflow.com', role: 'Super Admin', lastLogin: '2023-08-15 14:30' }
  ]);

  // Check for admin token
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      console.log('Admin authentication required, redirecting to login');
      navigate('/admin/login');
      return;
    }
    
    fetchAdminSettings();
  }, [navigate]);

  const fetchAdminSettings = async () => {
    setLoading(true);
    try {
      // Here you would normally fetch admin settings from backend
      // For this implementation, we'll simulate a delay and use the default values
      
      // In a real implementation, you would have API calls like:
      // const response = await fetch('http://localhost:5001/api/admin/settings', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      // });
      // const data = await response.json();
      // setStoreSettings(data.storeSettings);
      // etc.
      
      // For now, just simulate a delay
      setTimeout(() => {
        // Profile data might come from auth state or API
        const userName = localStorage.getItem('adminName') || 'Admin User';
        const userEmail = localStorage.getItem('adminEmail') || 'admin@feastflow.com';
        
        setProfileData({
          name: userName,
          email: userEmail,
          phone: '+91 9876543210',
        });
        
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Failed to fetch admin settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load settings: ' + error.message,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      // In a real app, you'd send updated profile data to the server
      // const response = await fetch('http://localhost:5001/api/admin/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify(profileData)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local storage to reflect changes
      localStorage.setItem('adminName', profileData.name);
      
      setSnackbar({
        open: true,
        message: 'Profile information updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 8 characters long',
        severity: 'error'
      });
      return;
    }
    
    setSavingPassword(true);
    try {
      // In a real app, you'd send updated password to the server
      // const response = await fetch('http://localhost:5001/api/admin/change-password', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      setSnackbar({
        open: true,
        message: 'Failed to change password: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleStoreSettingsSave = async () => {
    setSavingStoreSettings(true);
    try {
      // In a real app, you'd send store settings to the server
      // const response = await fetch('http://localhost:5001/api/admin/store-settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify(storeSettings)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Store settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update store settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update store settings: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSavingStoreSettings(false);
    }
  };

  const handleNotificationSettingsSave = async () => {
    try {
      // Simulate API call for saving notification settings
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSnackbar({
        open: true,
        message: 'Notification preferences updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update notification preferences: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you'd send delete request to the server
      // await fetch('http://localhost:5001/api/admin/account', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear admin credentials
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminEmail');
      
      // Close dialog
      setConfirmDeleteDialog(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Your admin account has been deleted successfully',
        severity: 'success'
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to delete account:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete account: ' + error.message,
        severity: 'error'
      });
      setConfirmDeleteDialog(false);
    }
  };

  const renderProfileSettings = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <SecurityIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Admin Profile</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            fullWidth
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            fullWidth
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            margin="normal"
          />
        </Grid>
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleProfileSave}
          disabled={savingProfile}
        >
          {savingProfile ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" alignItems="center" mb={3}>
        <SecurityIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Change Password</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Current Password"
            fullWidth
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="New Password"
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Confirm New Password"
            fullWidth
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            margin="normal"
            error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
            helperText={
              passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' 
                ? 'Passwords do not match' 
                : ''
            }
          />
        </Grid>
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handlePasswordSave}
          disabled={savingPassword}
        >
          {savingPassword ? 'Saving...' : 'Update Password'}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box mb={2}>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => setConfirmDeleteDialog(true)}
        >
          Delete Admin Account
        </Button>
      </Box>
    </Paper>
  );

  const renderStoreSettings = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <RestaurantIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Restaurant Information</Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Restaurant Name"
            fullWidth
            value={storeSettings.name}
            onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Restaurant Address"
            fullWidth
            multiline
            rows={2}
            value={storeSettings.address}
            onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Phone"
            fullWidth
            value={storeSettings.phone}
            onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Email"
            fullWidth
            type="email"
            value={storeSettings.email}
            onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Opening Hours"
            fullWidth
            value={storeSettings.openingHours}
            onChange={(e) => setStoreSettings({ ...storeSettings, openingHours: e.target.value })}
            margin="normal"
            placeholder="e.g., Mon-Sun: 10:00 AM - 10:00 PM"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6">Order & Payment Settings</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Tax Percentage"
            fullWidth
            type="number"
            value={storeSettings.taxPercentage}
            onChange={(e) => setStoreSettings({ ...storeSettings, taxPercentage: e.target.value })}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Delivery Fee"
            fullWidth
            type="number"
            value={storeSettings.deliveryFee}
            onChange={(e) => setStoreSettings({ ...storeSettings, deliveryFee: e.target.value })}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Minimum Order Amount"
            fullWidth
            type="number"
            value={storeSettings.minOrderAmount}
            onChange={(e) => setStoreSettings({ ...storeSettings, minOrderAmount: e.target.value })}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={storeSettings.allowGuestCheckout}
                onChange={(e) => setStoreSettings({ 
                  ...storeSettings, 
                  allowGuestCheckout: e.target.checked 
                })}
                color="primary"
              />
            }
            label="Allow Guest Checkout"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={storeSettings.enableOnlinePayments}
                onChange={(e) => setStoreSettings({ 
                  ...storeSettings, 
                  enableOnlinePayments: e.target.checked 
                })}
                color="primary"
              />
            }
            label="Enable Online Payments"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6">Welcome Message</Typography>
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        value={storeSettings.welcomeMessage}
        onChange={(e) => setStoreSettings({ ...storeSettings, welcomeMessage: e.target.value })}
        margin="normal"
        placeholder="This message will be shown to customers on the homepage"
      />

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleStoreSettingsSave}
          disabled={savingStoreSettings}
        >
          {savingStoreSettings ? 'Saving...' : 'Save Restaurant Settings'}
        </Button>
      </Box>
    </Paper>
  );

  const renderNotificationSettings = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Notification Preferences</Typography>
      </Box>

      <List>
        <ListItem>
          <ListItemText 
            primary="Email Notifications" 
            secondary="Receive general system notifications via email"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                emailNotifications: e.target.checked
              })}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="Order Alerts" 
            secondary="Get notified immediately when new orders are placed"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={notificationSettings.orderAlerts}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                orderAlerts: e.target.checked
              })}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="Marketing Emails" 
            secondary="Receive promotional content and marketing emails"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={notificationSettings.marketingEmails}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                marketingEmails: e.target.checked
              })}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="SMS Order Notifications" 
            secondary="Receive SMS notifications for new orders"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={notificationSettings.orderSMS}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                orderSMS: e.target.checked
              })}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="Low Stock Alerts" 
            secondary="Get notified when menu items are running low on inventory"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={notificationSettings.lowStockAlerts}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                lowStockAlerts: e.target.checked
              })}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleNotificationSettingsSave}
        >
          Save Notification Settings
        </Button>
      </Box>
    </Paper>
  );

  const renderAccountManagement = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <BusinessIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Admin Account Management</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" paragraph>
        Manage admin accounts for your restaurant. Super Admins have full access to all settings and features.
      </Typography>

      <Box mt={2} mb={4}>
        <Button variant="contained" color="primary">
          Add New Admin
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="admin accounts table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage your admin profile, restaurant settings, and notification preferences.
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="settings tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Profile Settings" id="tab-0" />
              <Tab label="Restaurant Settings" id="tab-1" />
              <Tab label="Notification Settings" id="tab-2" />
              <Tab label="Admin Management" id="tab-3" />
            </Tabs>
          </Box>

          {tabValue === 0 && renderProfileSettings()}
          {tabValue === 1 && renderStoreSettings()}
          {tabValue === 2 && renderNotificationSettings()}
          {tabValue === 3 && renderAccountManagement()}
        </Box>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={confirmDeleteDialog}
          onClose={() => setConfirmDeleteDialog(false)}
        >
          <DialogTitle>
            Confirm Delete Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your admin account? This action cannot be undone, and you will lose all access to the admin panel.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} color="error" variant="contained">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AdminLayout>
  );
};

export default AdminSettings;