import ErrorPage from './ErrorPage';
import { FiClock } from 'react-icons/fi';

const ServiceUnavailable = () => {
  return (
    <ErrorPage
      code="503"
      title="Service Unavailable"
      message="The server is temporarily unable to handle your request due to maintenance or overloading."
      icon={FiClock}
      iconColor="text-purple-600"
      iconBg="bg-purple-100"
    />
  );
};

export default ServiceUnavailable;
