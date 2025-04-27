import ErrorPage from './ErrorPage';
import { FiSearch } from 'react-icons/fi';

const NotFound = () => {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      message="The page you are looking for doesn't exist or has been moved."
      icon={FiSearch}
      iconColor="text-blue-600"
      iconBg="bg-blue-100"
    />
  );
};

export default NotFound;
