import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../store/slices/userSlice";
import { FiUser, FiSearch, FiFilter, FiEdit, FiEye, FiUserPlus } from "react-icons/fi";
import RegisterUserModal from "../components/modals/RegisterUserModal";

// Helper function to format dates safely with time
const formatDate = (dateString) => {
   if (!dateString) return "N/A";

   try {
      // Log the date string for debugging
      console.log("Formatting date string:", dateString);

      // Handle ISO format (e.g., "2025-03-27T12:18:45Z")
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
         console.warn("Invalid date detected:", dateString);
         return "Invalid Date";
      }

      // Format the date as MM/DD/YYYY, HH:MM AM/PM
      const dateOptions = {
         year: "numeric",
         month: "numeric",
         day: "numeric",
      };

      const timeOptions = {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      };

      const formattedDate = date.toLocaleDateString(undefined, dateOptions);
      const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

      return `${formattedDate}, ${formattedTime}`;
   } catch (error) {
      console.error("Error formatting date:", error, "for date string:", dateString);
      return "Invalid Date";
   }
};

const Users = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { users, totalElements, totalPages, pageSize, loading, error } = useSelector((state) => state.users);

   const [filters, setFilters] = useState({
      role: "",
      email: "",
      name: "",
   });

   // State for register user modal
   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

   // Track current page in component state
   const [currentPageState, setCurrentPageState] = useState(1);

   // Debug pagination values
   useEffect(() => {
      console.log("Pagination values:", { totalElements, totalPages, pageSize });
   }, [totalElements, totalPages, pageSize]);

   useEffect(() => {
      console.log("useEffect triggered with filters:", filters);
      // Reset to page 1 when filters change
      setCurrentPageState(1);
      dispatch(fetchUsers({ page: 1, size: 10, filters }));
   }, [dispatch, filters]);

   const handlePageChange = (page) => {
      console.log(`Changing to page ${page}`);
      setCurrentPageState(page);
      dispatch(fetchUsers({ page, size: pageSize, filters }));
   };

   // Use useCallback to prevent unnecessary re-renders
   const handleFilterChange = useCallback((e) => {
      const { name, value } = e.target;
      console.log(`Filter changed: ${name} = ${value}`);

      // For role filter, we'll show a message that it's filtered client-side
      if (name === "role" && value) {
         console.log("Role filtering will be applied client-side");
      }

      setFilters((prev) => ({ ...prev, [name]: value }));
   }, []);

   const handleSearch = (e) => {
      e.preventDefault();
      console.log("Search button clicked, applying filters:", filters);

      // All filters are now applied server-side
      console.log("All filters will be applied server-side");

      setCurrentPageState(1); // Reset to first page when applying filters
      dispatch(fetchUsers({ page: 1, size: pageSize, filters }));
   };

   // Open register user modal
   const handleOpenRegisterModal = () => {
      setIsRegisterModalOpen(true);
   };

   // Close register user modal
   const handleCloseRegisterModal = () => {
      setIsRegisterModalOpen(false);
      // Refresh the user list after registration
      dispatch(fetchUsers({ page: currentPageState, size: pageSize, filters }));
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium">Users</h1>
            <div className="flex space-x-3">
               <button
                  onClick={handleOpenRegisterModal}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center text-sm"
               >
                  <FiUserPlus className="mr-1" /> Quick Register
               </button>
               <button
                  onClick={() => navigate("/users/new")}
                  className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 flex items-center text-sm"
               >
                  <FiUser className="mr-1" /> Add User
               </button>
            </div>
         </div>

         {/* Filters */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                     Name
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                     </div>
                     <input
                        type="text"
                        id="name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Search by name"
                     />
                  </div>
               </div>

               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                     Email
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                     </div>
                     <input
                        type="text"
                        id="email"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Search by email"
                     />
                  </div>
               </div>

               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                     Role
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                     </div>
                     <select
                        id="role"
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-end">
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                     Search
                  </button>
               </div>
            </form>
         </div>

         {/* Users Table */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Name
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Email
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Role
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Created At
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                 <svg
                                    className="animate-spin h-5 w-5 text-primary-500 mb-2"
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
                                 <p className="text-sm text-gray-600">Loading users...</p>
                              </div>
                           </td>
                        </tr>
                     ) : error ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                              {error}
                           </td>
                        </tr>
                     ) : users && users.length === 0 ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center">
                              No users found
                           </td>
                        </tr>
                     ) : (
                        users &&
                        users.map((user) => (
                           <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                                       {user.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                       <div className="text-sm font-sf-regular text-gray-900">
                                          {user.name} {user.surname}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                       user.role === "admin"
                                          ? "bg-purple-100 text-purple-800"
                                          : user.role === "teacher"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                    title={`Role value: "${user.role}"`}
                                 >
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {formatDate(user.created_at || user.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <button
                                    onClick={() => navigate(`/users/${user.id}`)}
                                    className="text-primary-600 hover:text-primary-900 mr-3 inline-flex items-center"
                                 >
                                    <FiEye className="mr-1" /> View
                                 </button>
                                 <button
                                    onClick={() => navigate(`/users/${user.id}`)}
                                    className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                                 >
                                    <FiEdit className="mr-1" /> Edit
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            {totalElements > 0 && (
               <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                     <button
                        onClick={() => handlePageChange(Math.max(1, currentPageState - 1))}
                        disabled={currentPageState <= 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                           currentPageState <= 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                     >
                        Previous
                     </button>
                     <button
                        onClick={() => handlePageChange(currentPageState + 1)}
                        disabled={currentPageState >= totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                           currentPageState >= totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                     >
                        Next
                     </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                     <div>
                        <p className="text-sm text-gray-700">
                           {totalElements === 0 ? (
                              <span>No results found</span>
                           ) : (
                              <>
                                 Showing{" "}
                                 <span className="font-medium">
                                    {totalElements > 0 ? (currentPageState - 1) * pageSize + 1 : 0}
                                 </span>{" "}
                                 to <span className="font-medium">{Math.min(currentPageState * pageSize, totalElements)}</span> of{" "}
                                 <span className="font-medium">{totalElements}</span> results
                              </>
                           )}
                        </p>
                     </div>
                     {console.log("Should show pagination UI?", totalPages > 1, "totalPages =", totalPages)}
                     {/* Force show pagination for testing */}
                     {totalPages >= 1 && (
                        <div>
                           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                              <button
                                 onClick={() => handlePageChange(Math.max(1, currentPageState - 1))}
                                 disabled={currentPageState <= 1}
                                 className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPageState <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
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
                                          ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}
                                 >
                                    {page + 1}
                                 </button>
                              ))}

                              <button
                                 onClick={() => handlePageChange(currentPageState + 1)}
                                 disabled={currentPageState >= totalPages}
                                 className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPageState >= totalPages
                                       ? "text-gray-300 cursor-not-allowed"
                                       : "text-gray-500 hover:bg-gray-50"
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
            )}
         </div>

         {/* Register User Modal */}
         <RegisterUserModal isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} />
      </div>
   );
};

export default Users;
