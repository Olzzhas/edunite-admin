import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLogs,
  fetchLogLevels,
  fetchLogServices,
  countLogs,
  setFilters,
  resetFilters,
  clearSelectedLog,
  selectLog
} from '../store/slices/logSlice';
import { FiDatabase, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import LogFilters from '../components/logs/LogFilters';
import LogEntry from '../components/logs/LogEntry';
import LogDetail from '../components/logs/LogDetail';
import { getDefaultDateRange } from '../utils/logUtils';

const Logs = () => {
  const dispatch = useDispatch();
  const {
    logs,
    selectedLog,
    totalCount,
    logLevels,
    logServices,
    loading,
    error,
    filters
  } = useSelector((state) => state.logs);

  const [showDetail, setShowDetail] = useState(false);

  // Initialize with default date range on first load
  useEffect(() => {
    const defaultDates = getDefaultDateRange();
    dispatch(setFilters(defaultDates));
  }, [dispatch]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchLogLevels());
    dispatch(fetchLogServices());

    // Initial logs fetch with default filters
    const initialFetch = async () => {
      await dispatch(fetchLogs(filters));
      dispatch(countLogs(filters));
    };

    initialFetch();
  }, [dispatch]);

  const handleSearch = (newFilters) => {
    // Reset skip to 0 when applying new filters
    const updatedFilters = { ...newFilters, skip: 0 };
    dispatch(setFilters(updatedFilters));
    dispatch(fetchLogs(updatedFilters));
    dispatch(countLogs(updatedFilters));
  };

  const handleReset = (defaultFilters) => {
    dispatch(resetFilters());
    dispatch(setFilters(defaultFilters));
    dispatch(fetchLogs(defaultFilters));
    dispatch(countLogs(defaultFilters));
  };

  const handleLogSelect = (log) => {
    dispatch(clearSelectedLog());
    dispatch(selectLog(log));
    setShowDetail(true);
    console.log('Selected log:', log);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    dispatch(clearSelectedLog());
  };

  const handlePageChange = (direction) => {
    let newSkip = filters.skip;

    if (direction === 'next') {
      newSkip = filters.skip + filters.limit;
    } else if (direction === 'prev') {
      newSkip = Math.max(0, filters.skip - filters.limit);
    }

    const updatedFilters = { ...filters, skip: newSkip };
    dispatch(setFilters(updatedFilters));
    dispatch(fetchLogs(updatedFilters));
  };

  // Calculate pagination info
  const currentPage = Math.floor(filters.skip / filters.limit) + 1;
  const totalPages = Math.ceil(totalCount / filters.limit);
  const showingFrom = totalCount === 0 ? 0 : filters.skip + 1;
  const showingTo = Math.min(filters.skip + filters.limit, totalCount);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <button
          onClick={() => {
            dispatch(fetchLogs(filters));
            dispatch(countLogs(filters));
          }}
          className="flex items-center px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700"
          style={{ color: '#ffffff' }}
          disabled={loading}
        >
          <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} style={{ color: '#ffffff' }} />
          <span style={{ color: '#ffffff' }}>Refresh</span>
        </button>
      </div>

      <LogFilters
        filters={filters}
        onFilterChange={(name, value) => dispatch(setFilters({ [name]: value }))}
        onSearch={handleSearch}
        onReset={handleReset}
        logLevels={logLevels}
        logServices={logServices}
        isLoading={loading}
      />

      <div className="card rounded-lg shadow-sm overflow-hidden border">
        <div className="flex relative">
          {/* Logs List */}
          <div className={`${showDetail ? 'w-1/2' : 'w-full'} flex flex-col`}>
            {/* Logs Header */}
            <div className="p-4 border-b bg-secondary">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiDatabase className="mr-2" />
                  <h2 className="text-lg font-semibold">Logs</h2>
                </div>
                <div className="text-sm text-tertiary">
                  {totalCount > 0 ? (
                    <span>
                      Showing {showingFrom} to {showingTo} of {totalCount} logs
                    </span>
                  ) : (
                    <span>No logs found</span>
                  )}
                </div>
              </div>
            </div>

            {/* Logs List - with max height and scrolling */}
            <div className="divide-y overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                  <p className="mt-2 text-tertiary">Loading logs...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : !logs || logs.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-tertiary">No logs found matching your filters.</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <LogEntry
                    key={log.id || `${log.service}-${log.datetime}-${index}`}
                    log={log}
                    onClick={handleLogSelect}
                    isSelected={selectedLog && (
                      (selectedLog.id && selectedLog.id === log.id) ||
                      (selectedLog.datetime === log.datetime && selectedLog.message === log.message)
                    )}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="p-4 border-t flex justify-between items-center mt-auto">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={filters.skip === 0}
                  className={`flex items-center px-3 py-1 rounded border ${
                    filters.skip === 0
                      ? 'text-tertiary cursor-not-allowed border-gray-200'
                      : 'bg-white hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  <FiChevronLeft className="mr-1" />
                  Previous
                </button>

                <span className="text-sm text-tertiary">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  onClick={() => handlePageChange('next')}
                  disabled={showingTo >= totalCount}
                  className={`flex items-center px-3 py-1 rounded border ${
                    showingTo >= totalCount
                      ? 'text-tertiary cursor-not-allowed border-gray-200'
                      : 'bg-white hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  Next
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Log Detail Panel - Fixed position */}
          {showDetail && (
            <div className="w-1/2 border-l">
              <div className="sticky top-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <LogDetail log={selectedLog} onClose={handleCloseDetail} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
