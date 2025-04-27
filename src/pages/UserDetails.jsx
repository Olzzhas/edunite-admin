import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser, deleteUser, clearSelectedUser } from '../store/slices/userSlice';
import { FiUser, FiMail, FiTag, FiCalendar, FiSave, FiTrash2, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useAlertDialog } from '../contexts/AlertDialogContext';

// Helper function to format dates safely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error, 'for date string:', dateString);
    return 'Invalid Date';
  }
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { deleteConfirm } = useAlertDialog();

  const { selectedUser, loading, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch user details when component mounts or id changes
  useEffect(() => {
    // Only fetch if it's not a new user
    if (id !== 'new') {
      dispatch(fetchUserById(id));
    }

    // Cleanup function to clear selected user when component unmounts
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  // Update form data when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        surname: selectedUser.surname || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Create a new object for formData to ensure React detects the change
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    // Update the state with the new object
    setFormData(updatedFormData);

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }

    // Clear success message when user starts editing again
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const errors = {};
    if (!formData.name.trim()) errors.name = 'First name is required';
    if (!formData.surname.trim()) errors.surname = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.role) errors.role = 'Role is required';

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // If there are validation errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear previous validation errors and success message
    setValidationErrors({});
    setUpdateSuccess(false);
    setIsSaving(true);

    dispatch(updateUser({ id, userData: formData }))
      .unwrap()
      .then(() => {
        setIsSaving(false);
        setIsEditing(false);
        setUpdateSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        setIsSaving(false);
        console.error('Failed to update user:', error);

        // Handle API validation errors if they come back from the server
        if (error.includes('email')) {
          setValidationErrors({ email: 'This email is already in use or invalid' });
        } else {
          // Show generic error in the form
          setValidationErrors({
            form: 'Failed to update user. Please try again.'
          });
        }
      });
  };

  const handleDelete = () => {
    deleteConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${selectedUser.name} ${selectedUser.surname}? This action cannot be undone.`,
      onConfirm: () => {
        dispatch(deleteUser(id))
          .unwrap()
          .then(() => {
            navigate('/users');
          })
          .catch((error) => {
            console.error('Failed to delete user:', error);
          });
      }
    });
  };

  const handleCancel = () => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        surname: selectedUser.surname || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/users')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiSave className="mr-2" /> Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  // Make sure formData is up to date with selectedUser before enabling edit mode
                  if (selectedUser) {
                    setFormData({
                      name: selectedUser.name || '',
                      surname: selectedUser.surname || '',
                      email: selectedUser.email || '',
                      role: selectedUser.role || ''
                    });
                  }
                  setIsEditing(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit User
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FiTrash2 className="mr-2" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

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
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiTrash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading user</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : selectedUser ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-semibold mb-4">
                {selectedUser.name ? selectedUser.name.charAt(0) : '?'}
              </div>
              <h2 className="text-xl font-semibold">
                {selectedUser.name} {selectedUser.surname}
              </h2>
              <p className="text-gray-600 mb-2">{selectedUser.email}</p>
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  selectedUser.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : selectedUser.role === 'teacher'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {selectedUser.role}
              </span>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center py-2">
                <FiCalendar className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Created:</span>
                <span className="ml-auto text-sm">
                  {formatDate(selectedUser.created_at || selectedUser.createdAt)}
                </span>
              </div>
              <div className="flex items-center py-2">
                <FiCalendar className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="ml-auto text-sm">
                  {formatDate(selectedUser.updated_at || selectedUser.updatedAt)}
                </span>
              </div>
              {selectedUser.keycloakID && (
                <div className="flex items-center py-2">
                  <FiTag className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Keycloak ID:</span>
                  <span className="ml-auto text-sm truncate max-w-[150px]" title={selectedUser.keycloakID}>
                    {selectedUser.keycloakID}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Edit Form */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isEditing ? 'Edit User Information' : 'User Information'}
            </h2>

            {/* Success message */}
            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <FiCheck className="text-green-500 mr-2" />
                  <span className="text-green-700">User information updated successfully!</span>
                </div>
              </div>
            )}

            {/* Form-level error message */}
            {validationErrors.form && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <div className="text-red-500 mr-2">!</div>
                  <span className="text-red-700">{validationErrors.form}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className={`${validationErrors.name ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        validationErrors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : isEditing
                            ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 bg-gray-50'
                      } rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className={`${validationErrors.surname ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        validationErrors.surname
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : isEditing
                            ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 bg-gray-50'
                      } rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    />
                    {validationErrors.surname && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.surname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className={`${validationErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        validationErrors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : isEditing
                            ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 bg-gray-50'
                      } rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className={`${validationErrors.role ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        validationErrors.role
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : isEditing
                            ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 bg-gray-50'
                      } rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                    {validationErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiUser className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">User not found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The requested user could not be found. Please check the user ID and try again.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/users')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <FiArrowLeft className="mr-2" /> Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
