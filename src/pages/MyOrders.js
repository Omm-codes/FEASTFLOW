import React, { useContext } from "react";
import Layout from "../components/Layout/Layout";
import { CartContext } from "../context/cartContext";
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const MyOrders = () => {
  const { cart, setCart } = useContext(CartContext);

  const totalPrice = () => {
    let total = 0;
    cart.forEach((item) => (total += item.price));
    return total;
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleConfirmOrder = () => {
    alert("Order Confirmed!");
    setCart([]);
  };

  return (
    <Layout>
      <Box sx={{ m: 3 }}>
        <Typography variant="h4" align="center" mb={3}>
          My Orders
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="body1" align="center">
            Your cart is empty.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveItem(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box mt={3} textAlign="right">
          <Typography variant="h6">Total: ${totalPrice()}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            disabled={cart.length === 0}
            sx={{ mt: 2 }}
          >
            Confirm Order
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default MyOrders;