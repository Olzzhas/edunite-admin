import ErrorPage from './ErrorPage';
import { FiWifi } from 'react-icons/fi';

const BadGateway = () => {
  return (
    <ErrorPage
      code="502"
      title="Bad Gateway"
      message="The server received an invalid response from the upstream server."
      icon={FiWifi}
      iconColor="text-orange-600"
      iconBg="bg-orange-100"
    />
  );
};

export default BadGateway;
