import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads } from '../store/slices/threadSlice';
import { fetchCourses } from '../store/slices/courseSlice';
import { fetchSemesters } from '../store/slices/semesterSlice';
import { FiFilter, FiUsers, FiCalendar, FiClock, FiMapPin, FiPlus } from 'react-icons/fi';

const Threads = () => {
  const dispatch = useDispatch();
  const { threads, totalElements, totalPages, currentPage, pageSize, loading, error } = useSelector(
    (state) => state.threads
  );
  const { courses } = useSelector((state) => state.courses);
  const { semesters } = useSelector((state) => state.semesters);
  
  const [filters, setFilters] = useState({
    courseId: '',
    semesterId: '',
  });
  
  useEffect(() => {
    dispatch(fetchThreads({ page: 0, size: 10 }));
    dispatch(fetchCourses({ page: 0, size: 100 }));
    dispatch(fetchSemesters());
  }, [dispatch]);
  
  const handlePageChange = (page) => {
    dispatch(fetchThreads({ page, size: pageSize }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, we would filter threads by courseId and semesterId
    dispatch(fetchThreads({ page: 0, size: pageSize }));
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Threads</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
          <FiPlus className="mr-2" /> Create Thread
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                id="courseId"
                name="courseId"
                value={filters.courseId}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="semesterId" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                id="semesterId"
                name="semesterId"
                value={filters.semesterId}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
      
      {/* Threads List */}
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
        ) : threads.length === 0 ? (
          <div className="text-center py-12">No threads found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {threads.map((thread) => {
              const course = courses.find((c) => c.id === thread.courseId);
              const semester = semesters.find((s) => s.id === thread.semesterId);
              
              return (
                <div key={thread.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {course ? course.title : `Course #${thread.courseId}`}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiCalendar className="mr-1" />
                        <span>{semester ? semester.name : `Semester #${thread.semesterId}`}</span>
                      </div>
                      
                      {/* Teacher */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Teacher:</h4>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                            {thread.teacher.name.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {thread.teacher.name} {thread.teacher.surname}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Students */}
                      <div className="mt-4">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Students:</h4>
                          <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            {thread.students.length}
                          </span>
                        </div>
                        <div className="flex -space-x-2">
                          {thread.students.slice(0, 5).map((student) => (
                            <div
                              key={student.id}
                              className="h-8 w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center border-2 border-white"
                              title={`${student.name} ${student.surname}`}
                            >
                              {student.name.charAt(0)}
                            </div>
                          ))}
                          {thread.students.length > 5 && (
                            <div className="h-8 w-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center border-2 border-white">
                              +{thread.students.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Schedule */}
                      {thread.schedule && thread.schedule.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule:</h4>
                          <div className="space-y-2">
                            {thread.schedule.map((scheduleItem) => (
                              <div key={scheduleItem.id} className="flex items-center text-sm">
                                <div className="flex items-center mr-4">
                                  <FiClock className="mr-1 text-gray-500" />
                                  <span className="text-gray-600">
                                    {scheduleItem.dayOfWeek}, {scheduleItem.startTime} - {scheduleItem.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FiMapPin className="mr-1 text-gray-500" />
                                  <span className="text-gray-600">{scheduleItem.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200">
                        Manage
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 0
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
            
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages - 1
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
    </div>
  );
};

export default Threads;
