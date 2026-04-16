/**
 * Utility for admin authentication checks and route protection.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';

export const isAdminAuthenticated = () => {
  // Check for the admin token in localStorage
  return !!localStorage.getItem('adminToken');
};

export const AdminProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};
