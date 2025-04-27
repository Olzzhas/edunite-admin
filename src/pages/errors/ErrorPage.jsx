import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';

const ErrorPage = ({
  code = '404',
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.',
  icon: Icon = FiAlertTriangle,
  iconColor = 'text-red-600',
  iconBg = 'bg-red-100'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white dark:bg-gray-900">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <div className={`mx-auto w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mb-6`}>
            <Icon className={`h-12 w-12 ${iconColor}`} />
          </div>

          <h1 className="text-9xl font-bold text-gray-900 dark:text-white mb-4">{code}</h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiHome className="mr-2" /> <span className="text-white">Go to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2" /> <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
