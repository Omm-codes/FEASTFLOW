// This file contains middleware functions for authentication and authorization using JWT.
// It includes functions to authenticate tokens, check for admin privileges, and handle optional authentication.
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart with proper ID handling
  const addToCart = (item) => {
    console.log("Adding to cart:", item);
    
    // Make a copy of the item to avoid modifying the original
    const itemToAdd = { ...item };
    
    // Ensure item has a valid id (important for database operations later)
    if (!itemToAdd.id && itemToAdd.menu_item_id) {
      itemToAdd.id = itemToAdd.menu_item_id;
    } else if (!itemToAdd.menu_item_id && itemToAdd.id) {
      itemToAdd.menu_item_id = itemToAdd.id;
    }
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === itemToAdd.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
        return updatedCart;
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // Rest of your CartContext functions remain the same...

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart,
      // other functions...
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);