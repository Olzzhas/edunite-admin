/**
 * Handles HTTP errors by redirecting to the appropriate error page
 * @param {Error} error - The error object
 * @param {Function} navigate - The navigate function from react-router-dom
 */
export const handleHttpError = (error, navigate) => {
  // Extract status code from error response
  const statusCode = error?.response?.status;

  // Map status codes to error pages
  switch (statusCode) {
    case 400: // Bad Request
      console.error('Bad Request:', error);
      break;
    case 401: // Unauthorized
      navigate('/login');
      break;
    case 403: // Forbidden
      navigate('/error/403');
      break;
    case 404: // Not Found
      navigate('/error/404');
      break;
    case 500: // Server Error
      navigate('/error/500');
      break;
    case 502: // Bad Gateway
      navigate('/error/502');
      break;
    case 503: // Service Unavailable
      navigate('/error/503');
      break;
    default:
      // For other errors, log to console and navigate to 500 error page
      console.error('Unhandled error:', error);
      navigate('/error/500');
  }
};

/**
 * Creates an error handler function with the navigate function already bound
 * @param {Function} navigate - The navigate function from react-router-dom
 * @returns {Function} - A function that takes an error and handles it
 */
export const createErrorHandler = (navigate) => {
  return (error) => handleHttpError(error, navigate);
};

export default {
  handleHttpError,
  createErrorHandler
};
