/**
 * Formats a timestamp object from the API into a readable date string
 * @param {Object} timestamp - The timestamp object with seconds and nanos properties
 * @param {Object} options - Options for date formatting (passed to toLocaleDateString)
 * @returns {string} - Formatted date string
 */
export const formatTimestamp = (timestamp, options = {}) => {
  if (!timestamp) return 'N/A';

  try {
    // Check if timestamp is in the format with seconds and nanos
    if (timestamp.seconds) {
      // Convert seconds to milliseconds and create a Date object
      const date = new Date(timestamp.seconds * 1000);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return 'Invalid Date';
      }

      // Default options for date formatting
      const defaultOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
    }

    // Handle ISO format string (e.g., "2023-01-01T00:00:00Z")
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', timestamp);
        return 'Invalid Date';
      }

      // Default options for date formatting
      const defaultOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
    }

    // If timestamp is already a Date object
    if (timestamp instanceof Date) {
      // Default options for date formatting
      const defaultOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      return timestamp.toLocaleDateString(undefined, { ...defaultOptions, ...options });
    }

    console.warn('Unsupported timestamp format:', timestamp);
    return 'Invalid Format';
  } catch (error) {
    console.error('Error formatting timestamp:', error, 'for timestamp:', timestamp);
    return 'Error';
  }
};

/**
 * Formats a date string into a readable format
 * @param {string} dateString - The date string to format
 * @param {Object} options - Options for date formatting (passed to toLocaleDateString)
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid Date';
    }

    // Default options for date formatting
    const defaultOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error formatting date:', error, 'for date string:', dateString);
    return 'Invalid Date';
  }
};
