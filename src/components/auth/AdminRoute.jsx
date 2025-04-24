import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authService } from '../../services/api';
import UnauthorizedPage from '../../pages/auth/Unauthorized';

const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // First check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Then check if user has admin access
  const hasAdminAccess = authService.hasAdminAccess();
  
  // If not admin or moderator, show unauthorized page
  if (!hasAdminAccess) {
    return <UnauthorizedPage />;
  }
  
  // If authenticated and has admin access, render the child routes
  return <Outlet />;
};

export default AdminRoute;
