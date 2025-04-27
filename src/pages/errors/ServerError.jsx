import ErrorPage from './ErrorPage';
import { FiServer } from 'react-icons/fi';

const ServerError = () => {
  return (
    <ErrorPage
      code="500"
      title="Server Error"
      message="Oops! Something went wrong on our server. We're working to fix the issue."
      icon={FiServer}
      iconColor="text-red-600"
      iconBg="bg-red-100"
    />
  );
};

export default ServerError;
