import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-white text-xl" />;
      case 'error':
        return <FiAlertCircle className="text-white text-xl" />;
      default:
        return <FiCheckCircle className="text-white text-xl" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className={`rounded-lg shadow-lg overflow-hidden max-w-md ${getBackgroundColor()}`}>
        <div className="px-4 py-3 flex items-center">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
          <div className="flex-1 text-white font-medium">
            {message}
          </div>
          <div className="ml-3 flex-shrink-0">
            <button
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  onClose && onClose();
                }, 300);
              }}
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
