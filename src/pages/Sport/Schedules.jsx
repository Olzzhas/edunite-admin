import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSchedules,
  createWeeklySchedule,
  createSportPatterns
} from '../../store/slices/physicalEducationSlice';
import { fetchSportTypes } from '../../store/slices/sportTypeSlice';
import { fetchFacilities } from '../../store/slices/facilitySlice';
import { fetchSemesters } from '../../store/slices/semesterSlice';
import { FiCalendar, FiPlus, FiActivity, FiMapPin, FiUsers } from 'react-icons/fi';
import Card from '../../components/Card';

const Schedules = () => {
  const dispatch = useDispatch();
  const { schedules, loading, error } = useSelector((state) => state.physicalEducation);
  const { sportTypes } = useSelector((state) => state.sportTypes);
  const { facilities } = useSelector((state) => state.facilities);
  const { semesters } = useSelector((state) => state.semesters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('weekly'); // 'weekly' or 'pattern'
  const [formData, setFormData] = useState({
    facilityId: '',
    teacherId: '',
    sportTypeId: '',
    semesterId: '',
    dayOfWeek: '1', // 1 = Monday, 2 = Tuesday, etc.
    startTime: '',
    endTime: '',
    location: '',
    startDate: '',
    endDate: '',
  });

  const [patternFormData, setPatternFormData] = useState({
    sportTypeId: '',
    semesterId: '',
    patterns: [
      {
        schedules: [
          {
            facilityId: '',
            teacherId: '',
            dayOfWeek: '1',
            startTime: '',
            endTime: '',
            location: '',
          }
        ]
      }
    ],
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchSportTypes({ page: 1, size: 100 }));
    dispatch(fetchFacilities({ page: 1, size: 100 }));
    dispatch(fetchSemesters());
  }, [dispatch]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'weekDays') {
      // Handle multiple select for weekdays
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData({
        ...formData,
        weekDays: selectedValues,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePatternInputChange = (e, patternIndex, scheduleIndex, field) => {
    const newPatterns = [...patternFormData.patterns];
    newPatterns[patternIndex].schedules[scheduleIndex][field] = e.target.value;

    setPatternFormData({
      ...patternFormData,
      patterns: newPatterns,
    });
  };

  const handlePatternMainInputChange = (e) => {
    const { name, value } = e.target;
    setPatternFormData({
      ...patternFormData,
      [name]: value,
    });
  };

  const addScheduleToPattern = (patternIndex) => {
    const newPatterns = [...patternFormData.patterns];
    newPatterns[patternIndex].schedules.push({
      facilityId: '',
      teacherId: '',
      dayOfWeek: '1',
      startTime: '',
      endTime: '',
      location: '',
    });

    setPatternFormData({
      ...patternFormData,
      patterns: newPatterns,
    });
  };

  const removeScheduleFromPattern = (patternIndex, scheduleIndex) => {
    const newPatterns = [...patternFormData.patterns];
    newPatterns[patternIndex].schedules.splice(scheduleIndex, 1);

    setPatternFormData({
      ...patternFormData,
      patterns: newPatterns,
    });
  };

  const addPattern = () => {
    setPatternFormData({
      ...patternFormData,
      patterns: [
        ...patternFormData.patterns,
        {
          schedules: [
            {
              facilityId: '',
              teacherId: '',
              dayOfWeek: '1',
              startTime: '',
              endTime: '',
              location: '',
            }
          ]
        }
      ],
    });
  };

  const removePattern = (index) => {
    const newPatterns = [...patternFormData.patterns];
    newPatterns.splice(index, 1);
    setPatternFormData({
      ...patternFormData,
      patterns: newPatterns,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'weekly') {
      // Format dates to ISO format
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      dispatch(createWeeklySchedule(formattedData))
        .unwrap()
        .then(() => {
          closeModal();
          dispatch(fetchSchedules());
        })
        .catch((error) => {
          console.error('Failed to create weekly schedule:', error);
        });
    } else {
      // Format dates to ISO format
      const formattedData = {
        ...patternFormData,
        startDate: new Date(patternFormData.startDate).toISOString(),
        endDate: new Date(patternFormData.endDate).toISOString()
      };

      dispatch(createSportPatterns(formattedData))
        .unwrap()
        .then(() => {
          closeModal();
          dispatch(fetchSchedules());
        })
        .catch((error) => {
          console.error('Failed to create sport patterns:', error);
        });
    }
  };

  // Mock data for teachers
  const mockTeachers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
  ];

  // Mock data for schedules
  const mockSchedules = [
    {
      id: 1,
      sportType: 'Basketball',
      facility: 'Main Gym',
      teacher: 'John Doe',
      weekDay: 'MONDAY',
      startTime: '14:00',
      endTime: '15:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 2,
      sportType: 'Swimming',
      facility: 'Swimming Pool',
      teacher: 'Jane Smith',
      weekDay: 'WEDNESDAY',
      startTime: '16:00',
      endTime: '17:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 3,
      sportType: 'Tennis',
      facility: 'Tennis Court',
      teacher: 'Robert Johnson',
      weekDay: 'FRIDAY',
      startTime: '10:00',
      endTime: '11:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 4,
      sportType: 'Basketball',
      facility: 'Main Gym',
      teacher: 'John Doe',
      weekDay: 'WEDNESDAY',
      startTime: '16:00',
      endTime: '17:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 5,
      sportType: 'Swimming',
      facility: 'Swimming Pool',
      teacher: 'Jane Smith',
      weekDay: 'FRIDAY',
      startTime: '14:00',
      endTime: '15:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 6,
      sportType: 'Tennis',
      facility: 'Tennis Court',
      teacher: 'Robert Johnson',
      weekDay: 'MONDAY',
      startTime: '14:00',
      endTime: '15:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
    {
      id: 7,
      sportType: 'Volleyball',
      facility: 'Main Gym',
      teacher: 'John Doe',
      weekDay: 'THURSDAY',
      startTime: '14:00',
      endTime: '15:30',
      startDate: '2024-01-01',
      endDate: '2024-05-31',
    },
  ];

  // Group schedules by sport type
  const groupedSchedules = mockSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.sportType]) {
      acc[schedule.sportType] = [];
    }
    acc[schedule.sportType].push(schedule);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedules</h1>
        <div className="flex space-x-2">
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
            onClick={() => openModal('weekly')}
          >
            <FiPlus className="mr-2" /> Create Weekly Schedule
          </button>
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
            onClick={() => openModal('pattern')}
          >
            <FiPlus className="mr-2" /> Create Sport Pattern
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Schedules by Sport Type">
          {loading ? (
            <div className="flex justify-center py-8">
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
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : Object.keys(groupedSchedules).length === 0 ? (
            <div className="text-center py-8">No schedules found</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSchedules).map(([sportType, schedules]) => (
                <div key={sportType} className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      <FiActivity size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{sportType}</h3>
                    <span className="ml-2 text-sm text-secondary bg-secondary px-2 py-1 rounded-full">
                      {schedules.length} {schedules.length === 1 ? 'schedule' : 'schedules'}
                    </span>
                  </div>

                  <div className="overflow-x-auto bg-card rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-secondary">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                            Facility
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                            Day
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                            Period
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {schedules.map((schedule) => (
                          <tr key={schedule.id} className="hover:bg-secondary">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                  <FiMapPin size={16} />
                                </div>
                                <div className="ml-3 text-sm text-primary">{schedule.facility}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                  <FiUsers size={16} />
                                </div>
                                <div className="ml-3 text-sm text-primary">{schedule.teacher}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-primary">{schedule.weekDay}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-primary">{schedule.startTime} - {schedule.endTime}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-primary">{schedule.startDate} to {schedule.endDate}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity backdrop-blur-sm" aria-hidden="true">
              <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-card">
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-card">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-primary">
                        {modalType === 'weekly' ? 'Create Weekly Schedule' : 'Create Sport Pattern'}
                      </h3>

                      {modalType === 'weekly' ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="facilityId" className="block text-sm font-medium text-secondary">
                              Facility
                            </label>
                            <select
                              name="facilityId"
                              id="facilityId"
                              value={formData.facilityId}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a facility</option>
                              {facilities.map((facility) => (
                                <option key={facility.id} value={facility.id}>
                                  {facility.title || facility.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="teacherId" className="block text-sm font-medium text-secondary">
                              Teacher
                            </label>
                            <select
                              name="teacherId"
                              id="teacherId"
                              value={formData.teacherId}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a teacher</option>
                              {mockTeachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="sportTypeId" className="block text-sm font-medium text-secondary">
                              Sport Type
                            </label>
                            <select
                              name="sportTypeId"
                              id="sportTypeId"
                              value={formData.sportTypeId}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a sport type</option>
                              {sportTypes.map((sportType) => (
                                <option key={sportType.id} value={sportType.id}>
                                  {sportType.title || sportType.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="semesterId" className="block text-sm font-medium text-secondary">
                              Semester
                            </label>
                            <select
                              name="semesterId"
                              id="semesterId"
                              value={formData.semesterId}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a semester</option>
                              {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                  {semester.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-secondary">
                              Day of Week
                            </label>
                            <select
                              name="dayOfWeek"
                              id="dayOfWeek"
                              value={formData.dayOfWeek}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="1">Monday</option>
                              <option value="2">Tuesday</option>
                              <option value="3">Wednesday</option>
                              <option value="4">Thursday</option>
                              <option value="5">Friday</option>
                              <option value="6">Saturday</option>
                              <option value="7">Sunday</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-secondary">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="e.g., Main Gym"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Start Time
                              </label>
                              <input
                                type="time"
                                name="startTime"
                                id="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                End Time
                              </label>
                              <input
                                type="time"
                                name="endTime"
                                id="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date
                              </label>
                              <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                              </label>
                              <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="sportTypeId" className="block text-sm font-medium text-gray-700">
                              Sport Type
                            </label>
                            <select
                              name="sportTypeId"
                              id="sportTypeId"
                              value={patternFormData.sportTypeId}
                              onChange={handlePatternMainInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a sport type</option>
                              {sportTypes.map((sportType) => (
                                <option key={sportType.id} value={sportType.id}>
                                  {sportType.title || sportType.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="semesterId" className="block text-sm font-medium text-secondary">
                              Semester
                            </label>
                            <select
                              name="semesterId"
                              id="semesterId"
                              value={patternFormData.semesterId}
                              onChange={handlePatternMainInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                              <option value="">Select a semester</option>
                              {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                  {semester.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date
                              </label>
                              <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={patternFormData.startDate}
                                onChange={handlePatternMainInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                              </label>
                              <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={patternFormData.endDate}
                                onChange={handlePatternMainInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Patterns</h4>

                            {patternFormData.patterns.map((pattern, patternIndex) => (
                              <div key={patternIndex} className="mb-6 p-4 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-700">Pattern {patternIndex + 1}</h5>
                                  {patternFormData.patterns.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removePattern(patternIndex)}
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Remove Pattern
                                    </button>
                                  )}
                                </div>

                                {pattern.schedules.map((schedule, scheduleIndex) => (
                                  <div key={`${patternIndex}-${scheduleIndex}`} className="mb-4 p-3 border border-gray-100 rounded-md bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                      <h6 className="text-xs font-medium text-gray-700">Schedule {scheduleIndex + 1}</h6>
                                      {pattern.schedules.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeScheduleFromPattern(patternIndex, scheduleIndex)}
                                          className="text-red-600 hover:text-red-800 text-xs"
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Facility
                                        </label>
                                        <select
                                          value={schedule.facilityId}
                                          onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'facilityId')}
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        >
                                          <option value="">Select a facility</option>
                                          {facilities.map((facility) => (
                                            <option key={facility.id} value={facility.id}>
                                              {facility.title || facility.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Teacher
                                        </label>
                                        <select
                                          value={schedule.teacherId}
                                          onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'teacherId')}
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        >
                                          <option value="">Select a teacher</option>
                                          {mockTeachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                              {teacher.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Day of Week
                                        </label>
                                        <select
                                          value={schedule.dayOfWeek}
                                          onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'dayOfWeek')}
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        >
                                          <option value="1">Monday</option>
                                          <option value="2">Tuesday</option>
                                          <option value="3">Wednesday</option>
                                          <option value="4">Thursday</option>
                                          <option value="5">Friday</option>
                                          <option value="6">Saturday</option>
                                          <option value="7">Sunday</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Location
                                        </label>
                                        <input
                                          type="text"
                                          value={schedule.location}
                                          onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'location')}
                                          required
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                          placeholder="e.g., Main Gym"
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700">
                                            Start Time
                                          </label>
                                          <input
                                            type="time"
                                            value={schedule.startTime}
                                            onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'startTime')}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700">
                                            End Time
                                          </label>
                                          <input
                                            type="time"
                                            value={schedule.endTime}
                                            onChange={(e) => handlePatternInputChange(e, patternIndex, scheduleIndex, 'endTime')}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => addScheduleToPattern(patternIndex)}
                                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <FiPlus className="mr-1" /> Add Schedule
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={addPattern}
                              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <FiPlus className="mr-2" /> Add Pattern
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-secondary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm bg-card text-primary border-light"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
