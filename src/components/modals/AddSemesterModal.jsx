import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const AddSemesterModal = ({ isOpen, onClose, onSubmit }) => {
  const [semesterData, setSemesterData] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSemesterData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!semesterData.name.trim()) {
      newErrors.name = 'Semester name is required';
    }

    if (!semesterData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!semesterData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (semesterData.start_date && new Date(semesterData.start_date) > new Date(semesterData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Format dates to RFC3339 format
      const formattedData = {
        ...semesterData,
        start_date: new Date(semesterData.start_date).toISOString(),
        end_date: new Date(semesterData.end_date).toISOString(),
      };

      onSubmit(formattedData);

      // Reset form
      setSemesterData({
        name: '',
        start_date: '',
        end_date: '',
      });

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Semester</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={semesterData.name}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  placeholder="e.g., Spring 2025"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={semesterData.start_date}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.start_date ? 'border-red-300' : ''
                  }`}
                />
                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={semesterData.end_date}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.end_date ? 'border-red-300' : ''
                  }`}
                />
                {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                >
                  Add Semester
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSemesterModal;
