import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';

const OrderSummary = ({ order, fallbackText = 'Order details not available' }) => {
  if (!order) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {fallbackText}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Order #{order.id}
        </Typography>
        
        <List disablePadding>
          {order.items?.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body2">₹{item.price * item.quantity}</Typography>
            </ListItem>
          )) || (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="No items found" />
            </ListItem>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Subtotal" />
            <Typography variant="body1">₹{order.subtotal || 0}</Typography>
          </ListItem>
          
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Delivery Fee" />
            <Typography variant="body1">₹{order.deliveryFee || 0}</Typography>
          </ListItem>
          
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="h6">₹{order.total || 0}</Typography>
          </ListItem>
        </List>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Delivery Address:
          </Typography>
          <Typography variant="body1">
            {order.deliveryAddress || 'No address provided'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
