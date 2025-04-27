import ErrorPage from './ErrorPage';
import { FiLock } from 'react-icons/fi';

const Forbidden = () => {
  return (
    <ErrorPage
      code="403"
      title="Access Forbidden"
      message="You don't have permission to access this resource."
      icon={FiLock}
      iconColor="text-yellow-600"
      iconBg="bg-yellow-100"
    />
  );
};

export default Forbidden;
