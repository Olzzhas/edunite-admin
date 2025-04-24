import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSemesters, addSemesterBreak, createSemester } from '../store/slices/semesterSlice';
import { FiCalendar, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { formatTimestamp } from '../utils/dateUtils';
import AddBreakModal from '../components/modals/AddBreakModal';
import AddSemesterModal from '../components/modals/AddSemesterModal';

const Semesters = () => {
  const dispatch = useDispatch();
  const { semesters, loading, error } = useSelector((state) => state.semesters);

  // Track current page in component state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isAddBreakModalOpen, setIsAddBreakModalOpen] = useState(false);
  const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    dispatch(fetchSemesters());
  }, [dispatch]);

  // Calculate total pages when semesters change
  useEffect(() => {
    if (semesters && semesters.length > 0) {
      setTotalPages(Math.ceil(semesters.length / pageSize));
    }
  }, [semesters, pageSize]);

  // Get paginated semesters
  const getPaginatedSemesters = () => {
    if (!semesters || semesters.length === 0) return [];

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return semesters.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    console.log(`Changing to page ${page}`);
    setCurrentPage(page);
  };

  const handleOpenAddBreakModal = (semester) => {
    setSelectedSemester(semester);
    setIsAddBreakModalOpen(true);
  };

  const handleCloseAddBreakModal = () => {
    setIsAddBreakModalOpen(false);
    setSelectedSemester(null);
  };

  const handleAddBreak = (breakData) => {
    if (!selectedSemester) return;

    console.log('Adding break to semester:', selectedSemester.id, breakData);

    // Format date for API
    const formattedBreakData = {
      description: breakData.description,
      // Format as YYYY-MM-DD for the API
      break_date: breakData.breakDate
    };

    console.log('Formatted break data:', formattedBreakData);

    dispatch(addSemesterBreak({
      semesterId: selectedSemester.id,
      breakData: formattedBreakData
    }));
  };

  const handleOpenAddSemesterModal = () => {
    setIsAddSemesterModalOpen(true);
  };

  const handleCloseAddSemesterModal = () => {
    setIsAddSemesterModalOpen(false);
  };

  const handleAddSemester = (semesterData) => {
    console.log('Adding new semester:', semesterData);

    dispatch(createSemester(semesterData))
      .unwrap()
      .then(() => {
        // Refresh the semesters list
        dispatch(fetchSemesters());
      })
      .catch((error) => {
        console.error('Failed to create semester:', error);
        // You could add a toast notification here
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Semesters</h1>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          onClick={handleOpenAddSemesterModal}
        >
          <FiPlus className="mr-2" /> Add Semester
        </button>
      </div>

      {/* Semesters List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : semesters.length === 0 ? (
          <div className="text-center py-12">No semesters found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {getPaginatedSemesters().map((semester) => (
              <div key={semester.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{semester.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiCalendar className="mr-1" />
                      <span>
                        {formatTimestamp(semester.start_date || semester.startDate)} - {formatTimestamp(semester.end_date || semester.endDate)}
                      </span>
                    </div>

                    {/* Semester Breaks */}
                    {semester.breaks && semester.breaks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Breaks:</h4>
                        <div className="space-y-2">
                          {/* Sort breaks by date */}
                          {[...semester.breaks]
                            .sort((a, b) => {
                              // Sort by break_date (ascending)
                              if (a.break_date && b.break_date) {
                                return a.break_date.seconds - b.break_date.seconds;
                              }
                              return 0;
                            })
                            .map((breakItem) => (
                            <div key={breakItem.id} className="flex items-center text-sm">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span className="font-medium mr-2">{breakItem.description || breakItem.name}:</span>
                              <span className="text-gray-600">
                                {formatTimestamp(breakItem.break_date)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <FiEdit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Add Break Button */}
                <button
                  className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  onClick={() => handleOpenAddBreakModal(semester)}
                >
                  <FiPlus className="mr-1" /> Add Break
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {semesters.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {(totalPages > 0 ? [...Array(totalPages).keys()] : [0, 1]).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page + 1
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage >= totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Add Break Modal */}
      <AddBreakModal
        isOpen={isAddBreakModalOpen}
        onClose={handleCloseAddBreakModal}
        onSubmit={handleAddBreak}
        semesterName={selectedSemester?.name || ''}
      />

      {/* Add Semester Modal */}
      <AddSemesterModal
        isOpen={isAddSemesterModalOpen}
        onClose={handleCloseAddSemesterModal}
        onSubmit={handleAddSemester}
      />
    </div>
  );
};

export default Semesters;
