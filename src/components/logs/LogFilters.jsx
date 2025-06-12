import { useState, useEffect } from 'react';
import { getDefaultDateRange, formatServiceName, normalizeLogLevel } from '../../utils/logUtils';

const LogFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  logLevels,
  logServices,
  isLoading
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
    
    // For immediate filter changes (like dropdown selections)
    if (name === 'level' || name === 'service') {
      onFilterChange(name, value);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localFilters);
  };

  const handleReset = () => {
    const defaultDates = getDefaultDateRange();
    const resetFilters = {
      ...filters,
      level: '',
      service: '',
      ...defaultDates
    };
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  return (
    <div className="mb-6 p-4 bg-secondary rounded-lg border">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Log Level Filter */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              Log Level
            </label>
            <select
              id="level"
              name="level"
              value={localFilters.level}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="">All Levels</option>
              {logLevels.map((level) => (
                <option key={level} value={level}>
                  {normalizeLogLevel(level)}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium mb-1">
              Service
            </label>
            <select
              id="service"
              name="service"
              value={localFilters.service}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="">All Services</option>
              {logServices.map((service) => (
                <option key={service} value={service}>
                  {formatServiceName(service)}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-1">
              From
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={localFilters.start_date ? new Date(localFilters.start_date).toISOString().slice(0, 16) : ''}
              onChange={handleDateChange}
              className="w-full p-2 border rounded-md bg-background"
              disabled={isLoading}
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium mb-1">
              To
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={localFilters.end_date ? new Date(localFilters.end_date).toISOString().slice(0, 16) : ''}
              onChange={handleDateChange}
              className="w-full p-2 border rounded-md bg-background"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            disabled={isLoading}
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogFilters;
