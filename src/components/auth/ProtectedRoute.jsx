import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authService } from '../../services/api';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If requiredRole is 'admin', check if user has admin access
  if (requiredRole === 'admin' && !authService.hasAdminAccess()) {
    return <Navigate to="/unauthorized" />;
  }

  // For other specific roles
  if (requiredRole && requiredRole !== 'admin' && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and has the required role, render the children
  return <Outlet />;
};

export default ProtectedRoute;
