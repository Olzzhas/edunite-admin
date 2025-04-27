import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAvailableSportTypes,
  fetchAvailableFacilities,
  bookSession,
  cancelBooking
} from '../../store/slices/physicalEducationSlice';
import { FiCalendar, FiUsers, FiActivity, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/Card';
import { useAlertDialog } from '../../contexts/AlertDialogContext';

const PhysicalEducation = () => {
  const dispatch = useDispatch();
  const {
    availableSportTypes,
    availableFacilities,
    bookings,
    loading,
    error
  } = useSelector((state) => state.physicalEducation);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    scheduleId: '',
    sportTypeId: '',
  });

  useEffect(() => {
    dispatch(fetchAvailableSportTypes({ page: 1, size: 100 }));
    dispatch(fetchAvailableFacilities({ page: 1, size: 100 }));
  }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(bookSession(formData))
      .unwrap()
      .then(() => {
        closeModal();
        // Reset form
        setFormData({
          userId: '',
          scheduleId: '',
          sportTypeId: '',
        });
      })
      .catch((error) => {
        console.error('Failed to book session:', error);
      });
  };

  const { deleteConfirm } = useAlertDialog();

  const handleCancelBooking = (id, user, sportType, schedule) => {
    deleteConfirm({
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel the ${sportType} booking for ${user} (${schedule})? This action cannot be undone.`,
      confirmText: 'Cancel Booking',
      onConfirm: () => {
        dispatch(cancelBooking(id))
          .unwrap()
          .catch((error) => {
            console.error('Failed to cancel booking:', error);
          });
      }
    });
  };

  // Mock data for schedules and bookings
  const mockSchedules = [
    { id: 1, sportType: 'Basketball', facility: 'Main Gym', day: 'Monday', time: '14:00 - 15:30', teacher: 'John Doe' },
    { id: 2, sportType: 'Swimming', facility: 'Swimming Pool', day: 'Wednesday', time: '16:00 - 17:30', teacher: 'Jane Smith' },
    { id: 3, sportType: 'Tennis', facility: 'Tennis Court', day: 'Friday', time: '10:00 - 11:30', teacher: 'Robert Johnson' },
  ];

  const mockBookings = [
    { id: 1, user: 'Student 1', sportType: 'Basketball', schedule: 'Monday, 14:00 - 15:30', status: 'CONFIRMED' },
    { id: 2, user: 'Student 2', sportType: 'Swimming', schedule: 'Wednesday, 16:00 - 17:30', status: 'PENDING' },
    { id: 3, user: 'Student 3', sportType: 'Tennis', schedule: 'Friday, 10:00 - 11:30', status: 'CONFIRMED' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Physical Education</h1>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          onClick={openModal}
        >
          <FiPlus className="mr-2" /> Book Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Available Sport Types" className="h-full">
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
          ) : availableSportTypes.length === 0 ? (
            <div className="text-center py-8">No sport types available</div>
          ) : (
            <div className="space-y-4">
              {availableSportTypes.map((sportType) => (
                <div key={sportType.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <FiActivity size={18} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{sportType.name}</div>
                    <div className="text-xs text-gray-500">Max Participants: {sportType.maxParticipants}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Available Facilities" className="h-full">
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
          ) : availableFacilities.length === 0 ? (
            <div className="text-center py-8">No facilities available</div>
          ) : (
            <div className="space-y-4">
              {availableFacilities.map((facility) => (
                <div key={facility.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <FiMapPin size={18} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                    <div className="text-xs text-gray-500">Location: {facility.location} | Capacity: {facility.capacity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card title="Available Schedules">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <FiActivity size={16} />
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">{schedule.sportType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <FiMapPin size={16} />
                        </div>
                        <div className="ml-3 text-sm text-gray-900">{schedule.facility}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.day}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                          <FiUsers size={16} />
                        </div>
                        <div className="ml-3 text-sm text-gray-900">{schedule.teacher}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Current Bookings">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                          {booking.user.charAt(0)}
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">{booking.user}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.sportType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{booking.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCancelBooking(booking.id, booking.user, booking.sportType, booking.schedule)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                        Book a Session
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="userId" className="block text-sm font-medium text-secondary">
                            User
                          </label>
                          <select
                            name="userId"
                            id="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          >
                            <option value="">Select a user</option>
                            <option value="1">Student 1</option>
                            <option value="2">Student 2</option>
                            <option value="3">Student 3</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="scheduleId" className="block text-sm font-medium text-secondary">
                            Schedule
                          </label>
                          <select
                            name="scheduleId"
                            id="scheduleId"
                            value={formData.scheduleId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          >
                            <option value="">Select a schedule</option>
                            <option value="1">Basketball - Monday, 14:00 - 15:30</option>
                            <option value="2">Swimming - Wednesday, 16:00 - 17:30</option>
                            <option value="3">Tennis - Friday, 10:00 - 11:30</option>
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
                            {availableSportTypes.map((sportType) => (
                              <option key={sportType.id} value={sportType.id}>
                                {sportType.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Book
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

export default PhysicalEducation;
