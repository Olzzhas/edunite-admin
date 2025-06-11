/**
 * Get the appropriate color class for a log level
 * @param {string} level - The log level (e.g., 'error', 'info', 'warning')
 * @returns {string} - Tailwind CSS color class
 */
export const getLogLevelColor = (level) => {
  const normalizedLevel = level?.toLowerCase() || '';

  switch (normalizedLevel) {
    case 'error':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    case 'warn':
    case 'warning':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'info':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    case 'debug':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
    case 'trace':
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700/40 dark:text-gray-400';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700/40 dark:text-gray-400';
  }
};

/**
 * Get the appropriate icon class for a service
 * @param {string} service - The service name
 * @returns {string} - Tailwind CSS color class
 */
export const getServiceColor = (service) => {
  const normalizedService = service?.toLowerCase() || '';

  switch (normalizedService) {
    case 'user':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    case 'thread':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    case 'course':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
    case 'semester':
    case 'semester_break':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
    case 'keycloak':
      return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400';
    case 'thread_schedule':
    case 'thread_registration':
    case 'thread_groupmates':
      return 'text-teal-600 bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700/40 dark:text-gray-400';
  }
};

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatLogDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Format: Apr 24, 2025, 8:33 PM
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format JSON data for display
 * @param {Object} data - JSON data object
 * @returns {string} - Formatted JSON string
 */
export const formatJsonData = (data) => {
  if (!data) return '';

  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error formatting JSON data:', error);
    return String(data);
  }
};

/**
 * Get a default date range for log filtering (last 7 days)
 * @returns {Object} - Object with start_date and end_date in ISO format
 */
export const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7); // Last 7 days

  return {
    start_date: start.toISOString(),
    end_date: end.toISOString()
  };
};

/**
 * Normalize log level for display
 * @param {string} level - The log level (e.g., 'ERROR', 'info')
 * @returns {string} - Normalized log level (e.g., 'Error', 'Info')
 */
export const normalizeLogLevel = (level) => {
  if (!level) return '';

  // Handle case variations (INFO, info, Info)
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

/**
 * Format service name for display
 * @param {string} service - The service name (e.g., 'thread_registration')
 * @returns {string} - Formatted service name (e.g., 'Thread Registration')
 */
export const formatServiceName = (service) => {
  if (!service) return '';

  // Replace underscores with spaces and capitalize each word
  return service
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get the appropriate badge class for a log level
 * @param {string} level - The log level (e.g., 'error', 'info', 'warning')
 * @returns {string} - Tailwind CSS class for badge
 */
export const getLevelBadgeClass = (level) => {
  const normalizedLevel = level?.toLowerCase() || '';

  switch (normalizedLevel) {
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'warn':
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'debug':
      return 'bg-purple-100 text-purple-800';
    case 'trace':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
