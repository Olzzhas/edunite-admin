import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredSchedules, setFilters, clearFilters } from '../../store/slices/scheduleSlice';
import { fetchFacilities } from '../../store/slices/facilitySlice';
import { fetchSemesters } from '../../store/slices/semesterSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { FiCalendar, FiSearch, FiX, FiMapPin, FiUser, FiBook } from 'react-icons/fi';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

const FilteredSchedules = () => {
  const dispatch = useDispatch();
  const { schedules, totalElements, totalPages, currentPage, pageSize, loading, error, filters } = useSelector((state) => state.schedules);
  const { facilities } = useSelector((state) => state.facilities);
  const { semesters } = useSelector((state) => state.semesters);
  const { users } = useSelector((state) => state.users);

  const [localFilters, setLocalFilters] = useState({
    facility_id: '',
    teacher_id: '',
    semester_id: '',
    start_date: '',
    end_date: ''
  });

  const [currentPageState, setCurrentPageState] = useState(1);

  // Load initial data
  useEffect(() => {
    console.log('Loading initial data for FilteredSchedules');

    dispatch(fetchFacilities({ page: 1, size: 100 }))
      .then(response => console.log('Facilities loaded:', response))
      .catch(error => console.error('Error loading facilities:', error));

    dispatch(fetchSemesters({ page: 1, size: 100 }))
      .then(response => console.log('Semesters loaded:', response))
      .catch(error => console.error('Error loading semesters:', error));

    dispatch(fetchUsers({ page: 1, size: 100, filters: { role: 'teacher' } }))
      .then(response => console.log('Teachers loaded:', response))
      .catch(error => console.error('Error loading teachers:', error));

    // Load schedules with default filters
    dispatch(fetchFilteredSchedules({ page: 1, page_size: pageSize }))
      .then(response => console.log('Initial schedules loaded:', response))
      .catch(error => console.error('Error loading initial schedules:', error));
  }, [dispatch, pageSize]);

  // Update local filters when redux filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    console.log('Searching with filters:', localFilters);

    // Update filters in Redux
    dispatch(setFilters(localFilters));

    // Reset to first page when applying new filters
    setCurrentPageState(1);

    // Fetch filtered schedules
    dispatch(fetchFilteredSchedules({
      ...localFilters,
      page: 1,
      page_size: pageSize
    }))
      .then(response => console.log('Search results:', response))
      .catch(error => console.error('Error searching schedules:', error));
  };

  const handleClearFilters = () => {
    console.log('Clearing all filters');

    // Clear filters in local state and Redux
    setLocalFilters({
      facility_id: '',
      teacher_id: '',
      semester_id: '',
      start_date: '',
      end_date: ''
    });

    dispatch(clearFilters());

    // Reset to first page
    setCurrentPageState(1);

    // Fetch schedules without filters
    dispatch(fetchFilteredSchedules({ page: 1, page_size: pageSize }))
      .then(response => console.log('Results after clearing filters:', response))
      .catch(error => console.error('Error fetching schedules after clearing filters:', error));
  };

  const handlePageChange = (page) => {
    console.log('Changing to page:', page);
    setCurrentPageState(page);

    // Fetch schedules for the selected page
    dispatch(fetchFilteredSchedules({
      ...filters,
      page,
      page_size: pageSize
    }))
      .then(response => console.log('Page change results:', response))
      .catch(error => console.error('Error changing page:', error));
  };

  // Filter teachers from users
  const teachers = users.filter(user => user.role === 'teacher' || user.role === 'Teacher');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Sport Schedules</h1>
        <p className="text-gray-600">
          View and filter sport schedules by facility, teacher, semester, and date range.
        </p>
      </div>

      {/* Filter Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Filter Schedules</h2>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Facility Filter */}
            <div>
              <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700 mb-1">
                Facility
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <select
                  id="facility_id"
                  name="facility_id"
                  value={localFilters.facility_id}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Facilities</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teacher Filter */}
            <div>
              <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                Teacher
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={localFilters.teacher_id}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">All Teachers</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} {teacher.surname}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semester Filter */}
            <div>
              <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBook className="text-gray-400" />
                </div>
                <select
                  id="semester_id"
                  name="semester_id"
                  value={localFilters.semester_id}
                  onChange={handleInputChange}
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

            {/* Start Date Filter */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={localFilters.start_date}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* End Date Filter */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={localFilters.end_date}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FiX className="inline-block mr-1" /> Clear Filters
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiSearch className="inline-block mr-1" /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Schedules</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500"
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
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No schedules found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  // Find the facility and teacher objects
                  // API might use facility_id or facilityId, handle both
                  const facilityId = schedule.facility_id || schedule.facilityId;
                  const teacherId = schedule.teacher_id || schedule.teacherId;

                  const facility = facilities.find(f => f.id === facilityId);
                  const teacher = teachers.find(t => t.id === teacherId);

                  // Format date and time
                  let dateStr = 'N/A';
                  let timeStr = 'N/A';

                  try {
                    // Handle different timestamp formats
                    let startDate, endDate;

                    // Check for timestamp objects with seconds field (from API)
                    if (schedule.start_time && schedule.start_time.seconds) {
                      startDate = new Date(schedule.start_time.seconds * 1000);
                    } else if (schedule.start_date) {
                      startDate = new Date(schedule.start_date);
                    } else if (schedule.startDate) {
                      startDate = new Date(schedule.startDate);
                    }

                    if (schedule.end_time && schedule.end_time.seconds) {
                      endDate = new Date(schedule.end_time.seconds * 1000);
                    } else if (schedule.end_date) {
                      endDate = new Date(schedule.end_date);
                    } else if (schedule.endDate) {
                      endDate = new Date(schedule.endDate);
                    }

                    console.log('Parsed dates:', { startDate, endDate });

                    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                      dateStr = format(startDate, 'MMM d, yyyy');
                      timeStr = `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
                    }
                  } catch (error) {
                    console.error('Error formatting date:', error, 'Schedule:', schedule);

                    // Fallback formatting if date-fns fails
                    try {
                      let startDate, endDate;

                      // Try to handle timestamp objects
                      if (schedule.start_time && schedule.start_time.seconds) {
                        startDate = new Date(schedule.start_time.seconds * 1000);
                      } else if (schedule.start_date) {
                        startDate = new Date(schedule.start_date);
                      } else if (schedule.startDate) {
                        startDate = new Date(schedule.startDate);
                      }

                      if (schedule.end_time && schedule.end_time.seconds) {
                        endDate = new Date(schedule.end_time.seconds * 1000);
                      } else if (schedule.end_date) {
                        endDate = new Date(schedule.end_date);
                      } else if (schedule.endDate) {
                        endDate = new Date(schedule.endDate);
                      }

                      if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        dateStr = startDate.toLocaleDateString();
                        timeStr = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                  ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      }
                    } catch (fallbackError) {
                      console.error('Fallback date formatting also failed:', fallbackError);
                    }
                  }

                  return (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {schedule.facility && schedule.facility.title
                                ? schedule.facility.title
                                : facility
                                  ? facility.name || facility.title
                                  : 'Unknown Facility'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {teacher ? `${teacher.name} ${teacher.surname}` : 'Unknown Teacher'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {dateStr}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {timeStr}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {schedule.sport_type || schedule.sportType || 'General'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {schedule.total_spots || schedule.available_spots ||
                           (schedule.facility && schedule.facility.max_capacity) ||
                           schedule.max_capacity || schedule.capacity || 'Unlimited'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && schedules.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPageState}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredSchedules;
