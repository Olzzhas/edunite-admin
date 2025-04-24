import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/api/authService';

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
