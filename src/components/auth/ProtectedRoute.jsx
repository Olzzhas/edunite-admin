import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if the user has the required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  // If authenticated and has the required role, render the children
  return <Outlet />;
};

export default ProtectedRoute;
