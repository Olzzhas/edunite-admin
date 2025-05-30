import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFacilities, createFacility, updateFacility, deleteFacility } from '../../store/slices/facilitySlice';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiMapPin, FiUsers } from 'react-icons/fi';
import { useAlertDialog } from '../../contexts/AlertDialogContext';

const Facilities = () => {
  const dispatch = useDispatch();
  const { facilities, totalElements, totalPages, currentPage, pageSize, loading, error } = useSelector(
    (state) => state.facilities
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
    description: '',
  });

  // Track current page in component state
  const [currentPageState, setCurrentPageState] = useState(1);

  useEffect(() => {
    dispatch(fetchFacilities({ page: 1, size: 10 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPageState(page);
    dispatch(fetchFacilities({ page, size: pageSize }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, we would pass the search term to the API
    dispatch(fetchFacilities({ page: 1, size: pageSize }));
  };

  const openModal = (facility = null) => {
    if (facility) {
      setCurrentFacility(facility);
      setFormData({
        name: facility.title || facility.name || '',
        location: facility.location || '',
        capacity: facility.max_capacity || facility.capacity || 0,
        description: facility.description || '',
      });
    } else {
      setCurrentFacility(null);
      setFormData({
        name: '',
        location: '',
        capacity: 0,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFacility(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Transform form data to match API expectations
    const apiFormData = {
      title: formData.name,
      location: formData.location,
      max_capacity: formData.capacity,
      description: formData.description
    };

    console.log('Submitting facility data:', apiFormData);

    if (currentFacility) {
      dispatch(updateFacility({ id: currentFacility.id, facilityData: apiFormData }))
        .unwrap()
        .then(() => {
          closeModal();
          dispatch(fetchFacilities({ page: currentPageState, size: pageSize }));
        })
        .catch((error) => {
          console.error('Failed to update facility:', error);
        });
    } else {
      dispatch(createFacility(apiFormData))
        .unwrap()
        .then(() => {
          closeModal();
          dispatch(fetchFacilities({ page: 1, size: pageSize }));
          setCurrentPageState(1);
        })
        .catch((error) => {
          console.error('Failed to create facility:', error);
        });
    }
  };

  const { deleteConfirm } = useAlertDialog();

  const handleDelete = (id, facilityName) => {
    deleteConfirm({
      title: 'Delete Facility',
      message: `Are you sure you want to delete "${facilityName}"? This action cannot be undone.`,
      onConfirm: () => {
        dispatch(deleteFacility(id))
          .unwrap()
          .then(() => {
            dispatch(fetchFacilities({ page: currentPageState, size: pageSize }));
          })
          .catch((error) => {
            console.error('Failed to delete facility:', error);
          });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facilities</h1>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          onClick={() => openModal()}
        >
          <FiPlus className="mr-2" /> Add Facility
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search facilities..."
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Facilities Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-primary-500"
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
                  <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : facilities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No facilities found
                  </td>
                </tr>
              ) : (
                facilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <FiMapPin size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {facility.title || facility.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{facility.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUsers className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{facility.max_capacity || facility.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{facility.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(facility)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(facility.id, facility.title || facility.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{facilities.length > 0 ? (currentPageState - 1) * pageSize + 1 : 0}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPageState * pageSize, totalElements)}
                </span>{' '}
                of <span className="font-medium">{totalElements}</span> results
              </p>
            </div>
            {totalPages > 1 && (
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPageState - 1))}
                    disabled={currentPageState <= 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPageState <= 1
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
                        currentPageState === page + 1
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPageState + 1))}
                    disabled={currentPageState >= totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPageState >= totalPages
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
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {currentFacility ? 'Edit Facility' : 'Add Facility'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
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
                          />
                        </div>
                        <div>
                          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                            Capacity
                          </label>
                          <input
                            type="number"
                            name="capacity"
                            id="capacity"
                            min="1"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentFacility ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default Facilities;
