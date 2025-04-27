import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setErrorHandler } from '../services/api/apiClient';
import { createErrorHandler } from '../utils/errorHandler';

/**
 * Component that sets up the global error handler
 * This component doesn't render anything, it just sets up the error handler
 */
const ErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Create an error handler with the navigate function
      const handler = createErrorHandler(navigate);

      // Set the global error handler
      setErrorHandler(handler);

      // Clean up when the component unmounts
      return () => {
        setErrorHandler(null);
      };
    } catch (error) {
      console.error('Error setting up error handler:', error);
    }
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default ErrorHandler;
