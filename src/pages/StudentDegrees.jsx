import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudentDegrees, deleteStudentDegree } from "../store/slices/studentDegreeSlice";
import { fetchDegrees } from "../store/slices/degreeSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiUser, FiBook, FiCalendar } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { useAlertDialog } from "../contexts/AlertDialogContext";
import CreateStudentDegreeModal from "../components/modals/CreateStudentDegreeModal";
import EditStudentDegreeModal from "../components/modals/EditStudentDegreeModal";

const StudentDegrees = () => {
   const dispatch = useDispatch();
   const { allStudentDegrees, loading, error, totalCount, totalPages, currentPage } = useSelector(
      (state) => state.studentDegrees
   );
   const { degrees } = useSelector((state) => state.degrees);
   const { users } = useSelector((state) => state.users);
   const { addToast } = useToast();
   const { showAlert } = useAlertDialog();

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedStudentDegree, setSelectedStudentDegree] = useState(null);
   const [filters, setFilters] = useState({
      status: "",
      degree_id: "",
   });

   const pageSize = 10;

   // Get students from users
   const students = users ? users.filter((user) => user.role === "student") : [];

   useEffect(() => {
      dispatch(fetchAllStudentDegrees({ page: currentPage, pageSize, filters }));
   }, [dispatch, currentPage, filters]);

   useEffect(() => {
      dispatch(fetchDegrees({ page: 1, pageSize: 100 }));
      dispatch(fetchUsers({ page: 1, size: 100 }));
   }, [dispatch]);

   const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
   };

   const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
         dispatch(fetchAllStudentDegrees({ page, pageSize, filters }));
      }
   };

   const handleCreateStudentDegree = () => {
      setIsCreateModalOpen(true);
   };

   const handleEditStudentDegree = (studentDegree) => {
      setSelectedStudentDegree(studentDegree);
      setIsEditModalOpen(true);
   };

   const handleDeleteStudentDegree = async (studentDegree) => {
      const studentName = getStudentName(studentDegree.user_id);
      const degreeName = studentDegree.degree?.name || "Unknown Degree";

      const confirmed = await showAlert({
         title: "Delete Student Degree",
         message: `Are you sure you want to delete the degree enrollment for ${studentName} in ${degreeName}? This action cannot be undone.`,
         type: "delete",
         confirmText: "Delete",
         cancelText: "Cancel",
      });

      if (confirmed) {
         try {
            await dispatch(deleteStudentDegree(studentDegree.id)).unwrap();
            addToast("Student degree deleted successfully!", "success");
         } catch (error) {
            console.error("Error deleting student degree:", error);
            addToast(`Failed to delete student degree: ${error}`, "error");
         }
      }
   };

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
   };

   const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedStudentDegree(null);
   };

   const getStatusBadgeColor = (status) => {
      switch (status) {
         case "IN_PROGRESS":
            return "bg-blue-100 text-blue-800";
         case "COMPLETED":
            return "bg-green-100 text-green-800";
         case "WITHDRAWN":
            return "bg-yellow-100 text-yellow-800";
         case "TRANSFERRED":
            return "bg-purple-100 text-purple-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   const getStatusDisplayName = (status) => {
      switch (status) {
         case "IN_PROGRESS":
            return "In Progress";
         case "COMPLETED":
            return "Completed";
         case "WITHDRAWN":
            return "Withdrawn";
         case "TRANSFERRED":
            return "Transferred";
         default:
            return status;
      }
   };

   const getStudentName = (userId) => {
      const student = students.find((s) => s.id === userId);
      return student ? `${student.name} ${student.surname}` : `Student #${userId}`;
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Student Degrees</h1>
            <button
               className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
               onClick={handleCreateStudentDegree}
            >
               <FiPlus className="mr-2" /> Enroll Student
            </button>
         </div>

         {/* Filters */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                     Status
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                     </div>
                     <select
                        id="status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">All Statuses</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                        <option value="TRANSFERRED">Transferred</option>
                     </select>
                  </div>
               </div>

               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="degree_id" className="block text-sm font-medium text-gray-700 mb-1">
                     Degree Program
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBook className="text-gray-400" />
                     </div>
                     <select
                        id="degree_id"
                        name="degree_id"
                        value={filters.degree_id}
                        onChange={handleFilterChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">All Degrees</option>
                        {degrees &&
                           Array.isArray(degrees) &&
                           degrees.map((degree) => (
                              <option key={degree.id} value={degree.id}>
                                 {degree.name}
                              </option>
                           ))}
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Student Degrees List */}
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
            ) : allStudentDegrees.length === 0 ? (
               <div className="text-center py-12">No student degrees found</div>
            ) : (
               <div className="divide-y divide-gray-200">
                  {allStudentDegrees.map((studentDegree) => (
                     <div key={studentDegree.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                              <div className="flex items-center mb-2">
                                 <FiUser className="text-primary-600 mr-2" size={20} />
                                 <h3 className="text-lg font-sf-regular text-gray-900">
                                    {getStudentName(studentDegree.user_id)}
                                 </h3>
                                 <span
                                    className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                                       studentDegree.status
                                    )}`}
                                 >
                                    {getStatusDisplayName(studentDegree.status)}
                                 </span>
                              </div>

                              <div className="flex items-center mb-3">
                                 <FiBook className="text-gray-400 mr-2" />
                                 <span className="text-gray-900 font-medium">
                                    {studentDegree.degree?.name || "Unknown Degree"}
                                 </span>
                              </div>

                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                 <div className="flex items-center">
                                    <FiCalendar className="mr-1" />
                                    <span>Started: {formatTimestamp(studentDegree.start_date)}</span>
                                 </div>
                                 {studentDegree.expected_graduation_date && (
                                    <div className="flex items-center">
                                       <FiCalendar className="mr-1" />
                                       <span>Expected: {formatTimestamp(studentDegree.expected_graduation_date)}</span>
                                    </div>
                                 )}
                                 {studentDegree.actual_graduation_date && (
                                    <div className="flex items-center">
                                       <FiCalendar className="mr-1" />
                                       <span>Graduated: {formatTimestamp(studentDegree.actual_graduation_date)}</span>
                                    </div>
                                 )}
                                 {studentDegree.final_gpa && (
                                    <div>
                                       <span>Final GPA: {studentDegree.final_gpa}</span>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <div className="flex space-x-2">
                              <button
                                 className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 flex items-center"
                                 onClick={() => handleEditStudentDegree(studentDegree)}
                              >
                                 <FiEdit className="mr-1" size={14} /> Edit
                              </button>
                              <button
                                 className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200 flex items-center"
                                 onClick={() => handleDeleteStudentDegree(studentDegree)}
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
         <CreateStudentDegreeModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            students={students}
            degrees={degrees}
         />
         <EditStudentDegreeModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            studentDegree={selectedStudentDegree}
            students={students}
            degrees={degrees}
         />
      </div>
   );
};

export default StudentDegrees;
