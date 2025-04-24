import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <FiAlertTriangle className="h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="mt-1 text-center text-md text-gray-500">
            This area is restricted to administrators and moderators only.
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiHome className="mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
