// This file contains utility functions that can be used throughout the application for various tasks.

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US');
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};