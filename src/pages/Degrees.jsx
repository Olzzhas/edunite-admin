import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegrees, deleteDegree } from "../store/slices/degreeSlice";
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiBook, FiUsers } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { useAlertDialog } from "../contexts/AlertDialogContext";
import CreateDegreeModal from "../components/modals/CreateDegreeModal";
import EditDegreeModal from "../components/modals/EditDegreeModal";

const Degrees = () => {
   const dispatch = useDispatch();
   const { degrees, loading, error, totalCount, totalPages, currentPage } = useSelector((state) => state.degrees);
   const { addToast } = useToast();
   const { showAlert } = useAlertDialog();

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedDegree, setSelectedDegree] = useState(null);
   const [filters, setFilters] = useState({
      level: "",
   });

   const pageSize = 10;

   useEffect(() => {
      dispatch(fetchDegrees({ page: currentPage, pageSize, level: filters.level }));
   }, [dispatch, currentPage, filters.level]);

   const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
   };

   const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
         dispatch(fetchDegrees({ page, pageSize, level: filters.level }));
      }
   };

   const handleCreateDegree = () => {
      setIsCreateModalOpen(true);
   };

   const handleEditDegree = (degree) => {
      setSelectedDegree(degree);
      setIsEditModalOpen(true);
   };

   const handleDeleteDegree = (degree) => {
      showAlert({
         title: "Delete Degree Program",
         message: `Are you sure you want to delete "${degree.name}"? This action cannot be undone.`,
         type: "danger",
         onConfirm: () => {
            dispatch(deleteDegree(degree.id))
               .unwrap()
               .then(() => {
                  addToast("Degree program deleted successfully!", "success");
               })
               .catch((error) => {
                  addToast(`Failed to delete degree program: ${error}`, "error");
               });
         },
      });
   };

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
   };

   const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedDegree(null);
   };

   const getLevelBadgeColor = (level) => {
      switch (level) {
         case "bachelor":
            return "bg-blue-100 text-blue-800";
         case "master":
            return "bg-purple-100 text-purple-800";
         case "phd":
            return "bg-red-100 text-red-800";
         case "certificate":
            return "bg-green-100 text-green-800";
         case "diploma":
            return "bg-yellow-100 text-yellow-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   const getLevelDisplayName = (level) => {
      switch (level) {
         case "bachelor":
            return "Bachelor";
         case "master":
            return "Master";
         case "phd":
            return "PhD";
         case "certificate":
            return "Certificate";
         case "diploma":
            return "Diploma";
         default:
            return level;
      }
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Degree Programs</h1>
            <button
               className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
               onClick={handleCreateDegree}
            >
               <FiPlus className="mr-2" /> Create Degree Program
            </button>
         </div>

         {/* Filters */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                     Level
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                     </div>
                     <select
                        id="level"
                        name="level"
                        value={filters.level}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">All Levels</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                        <option value="certificate">Certificate</option>
                        <option value="diploma">Diploma</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Degrees List */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
               <div className="flex justify-center py-12">
                  <svg
                     className="animate-spin h-8 w-8 text-primary-500"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                  >
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                     ></path>
                  </svg>
               </div>
            ) : error ? (
               <div className="text-center py-12 text-red-500">{error}</div>
            ) : degrees.length === 0 ? (
               <div className="text-center py-12">No degree programs found</div>
            ) : (
               <div className="divide-y divide-gray-200">
                  {degrees.map((degree) => (
                     <div key={degree.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                              <div className="flex items-center mb-2">
                                 <FiBook className="text-primary-600 mr-2" size={20} />
                                 <h3 className="text-lg font-sf-regular text-gray-900">{degree.name}</h3>
                                 <span
                                    className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(
                                       degree.level
                                    )}`}
                                 >
                                    {getLevelDisplayName(degree.level)}
                                 </span>
                              </div>

                              {degree.description && <p className="text-gray-600 mb-3">{degree.description}</p>}

                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                 <div className="flex items-center">
                                    <FiBook className="mr-1" />
                                    <span>{degree.required_credits} credits required</span>
                                 </div>
                                 <div className="flex items-center">
                                    <FiUsers className="mr-1" />
                                    <span>Min GPA: {degree.min_gpa}</span>
                                 </div>
                                 <div>
                                    <span>Created: {formatTimestamp(degree.created_at)}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex space-x-2">
                              <button
                                 className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 flex items-center"
                                 onClick={() => handleEditDegree(degree)}
                              >
                                 <FiEdit className="mr-1" size={14} /> Edit
                              </button>
                              <button
                                 className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200 flex items-center"
                                 onClick={() => handleDeleteDegree(degree)}
                              >
                                 <FiTrash2 className="mr-1" size={14} /> Delete
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center">
               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                     onClick={() => handlePageChange(currentPage - 1)}
                     disabled={currentPage === 1}
                     className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                     }`}
                  >
                     <span className="sr-only">Previous</span>
                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                           currentPage === page + 1
                              ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                     >
                        {page + 1}
                     </button>
                  ))}

                  <button
                     onClick={() => handlePageChange(currentPage + 1)}
                     disabled={currentPage === totalPages}
                     className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                     }`}
                  >
                     <span className="sr-only">Next</span>
                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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

         {/* Modals */}
         <CreateDegreeModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
         <EditDegreeModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} degree={selectedDegree} />
      </div>
   );
};

export default Degrees;
