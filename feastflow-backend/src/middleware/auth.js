// This file contains middleware functions for authentication and authorization using JWT.
// It includes functions to authenticate tokens, check for admin privileges, and handle optional authentication.
// Import necessary modules
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Log the decoded token data
    console.log('Authenticated user:', user);
    
    req.user = user;
    next();
  });
};

export const optionalAuthToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('----- Request headers -----');
  console.log('Authorization header present:', !!authHeader);
  
  if (token) {
    console.log('Token found in authorization header');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        console.log('JWT verified successfully:', user);
        req.user = user;
      } else {
        console.log('JWT verification failed:', err.message);
      }
    });
  } else {
    console.log('No token found, treating as guest checkout');
  }
  
  console.log('req.user after auth check:', req.user);
  next();
};

// Add the missing isAdmin middleware
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  console.log(`Admin access granted to user: ${req.user.id}`);
  
  next();
};