import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads, updateThread, createThreadWithSchedule } from "../store/slices/threadSlice";
import { fetchCourses } from "../store/slices/courseSlice";
import { fetchSemesters } from "../store/slices/semesterSlice";
import { fetchUsers } from "../store/slices/userSlice";
import {
   FiFilter,
   FiUsers,
   FiCalendar,
   FiClock,
   FiMapPin,
   FiPlus,
   FiBook,
   FiUser,
   FiEdit,
   FiTrash2,
   FiList,
} from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import EditThreadModal from "../components/modals/EditThreadModal";
import CreateThreadModal from "../components/modals/CreateThreadModal";
import ThreadDetailsModal from "../components/modals/ThreadDetailsModal";
import { useToast } from "../contexts/ToastContext";

const Threads = () => {
   const dispatch = useDispatch();
   const { threads, loading, error } = useSelector((state) => state.threads);
   const { addToast } = useToast();
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 10; // Local page size
   const { courses } = useSelector((state) => state.courses);
   const { semesters } = useSelector((state) => state.semesters);
   const { users } = useSelector((state) => state.users);

   // State for edit modal
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedThread, setSelectedThread] = useState(null);

   // State for create modal
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   // State for details modal
   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
   const [selectedThreadForDetails, setSelectedThreadForDetails] = useState(null);

   // Get teachers from users
   const teachers = users ? users.filter((user) => user.role === "teacher") : [];

   const [filters, setFilters] = useState({
      courseId: "",
      semesterId: "",
   });

   // State for client-side filtering
   const [filteredThreads, setFilteredThreads] = useState([]);

   useEffect(() => {
      dispatch(fetchThreads({ page: 1, size: 100 })); // Fetch more threads for client-side filtering
      dispatch(fetchCourses({ page: 1, size: 100 }));
      dispatch(fetchSemesters());
      dispatch(fetchUsers({ page: 1, size: 100 }));
   }, [dispatch]);

   // Apply filters when threads or filter values change
   useEffect(() => {
      if (threads.length > 0) {
         let filtered = [...threads];

         // Filter by course ID
         if (filters.courseId) {
            filtered = filtered.filter((thread) => thread.course_id === parseInt(filters.courseId));
         }

         // Filter by semester ID
         if (filters.semesterId) {
            filtered = filtered.filter((thread) => thread.semester_id === parseInt(filters.semesterId));
         }

         setFilteredThreads(filtered);
      } else {
         setFilteredThreads([]);
      }
   }, [threads, filters]);

   const handlePageChange = (page) => {
      // Since we're doing client-side filtering, we don't need to fetch new data
      // Just update the current page in local state
      if (page >= 1 && page <= calculatedTotalPages) {
         // We're not using the Redux state for pagination anymore
         // Instead, we're tracking it locally
         setCurrentPage(page);
      }
   };

   const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
   };

   const handleSearch = (e) => {
      e.preventDefault();
      // Filters are already applied in the useEffect
   };

   const handleOpenEditModal = (thread) => {
      setSelectedThread(thread);
      setIsEditModalOpen(true);
   };

   const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedThread(null);
   };

   const handleOpenCreateModal = () => {
      setIsCreateModalOpen(true);
   };

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
   };

   const handleOpenDetailsModal = (thread) => {
      setSelectedThreadForDetails(thread);
      setIsDetailsModalOpen(true);
   };

   const handleCloseDetailsModal = () => {
      setIsDetailsModalOpen(false);
      setSelectedThreadForDetails(null);
   };

   const handleUpdateThread = (id, threadData) => {
      console.log("Updating thread:", id, threadData);

      dispatch(updateThread({ id, threadData }))
         .unwrap()
         .then(() => {
            // Close the modal
            handleCloseEditModal();

            // Show success message (you could add a toast notification here)
            console.log("Thread updated successfully");
         })
         .catch((error) => {
            console.error("Failed to update thread:", error);
            // Show error message (you could add a toast notification here)
         });
   };

   const handleCreateThread = (threadData) => {
      console.log("Creating thread with schedule:", threadData);

      // Show loading toast
      addToast("Creating thread...", "info", 2000);

      dispatch(createThreadWithSchedule(threadData))
         .unwrap()
         .then((response) => {
            // Close the modal
            handleCloseCreateModal();

            // Show success message
            console.log("Thread created successfully:", response);
            addToast("Thread created successfully!", "success", 3000);

            // Refresh the threads list
            dispatch(fetchThreads({ page: currentPage, size: pageSize }));
         })
         .catch((error) => {
            console.error("Failed to create thread:", error);

            // Show detailed error if available
            if (error.response && error.response.data) {
               console.error("Error details:", error.response.data);
            }

            // Try to extract a meaningful error message
            let errorMessage = "Unknown error";
            if (error.message) {
               errorMessage = error.message;
            } else if (error.response && error.response.data) {
               if (typeof error.response.data === "string") {
                  errorMessage = error.response.data;
               } else if (error.response.data.error) {
                  errorMessage = error.response.data.error;
               } else if (error.response.data.message) {
                  errorMessage = error.response.data.message;
               }
            }

            // Show error toast
            addToast(`Failed to create thread: ${errorMessage}`, "error", 5000);
         });
   };

   // Calculate pagination for filtered threads (adjust for 1-based indexing)
   const paginatedThreads = filteredThreads.slice((currentPage - 1) * pageSize, currentPage * pageSize);
   const calculatedTotalPages = Math.ceil(filteredThreads.length / pageSize);

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Threads</h1>
            <button
               className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
               onClick={handleOpenCreateModal}
            >
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
                        {/* Get unique courses from threads */}
                        {Array.from(new Set(threads.map((thread) => thread.course_id)))
                           .map((courseId) => {
                              const course = threads.find((t) => t.course_id === courseId)?.course;
                              return course ? (
                                 <option key={course.id} value={course.id}>
                                    {course.title}
                                 </option>
                              ) : null;
                           })
                           .filter(Boolean)}
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
                  <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
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
            ) : threads.length === 0 ? (
               <div className="text-center py-12">No threads found</div>
            ) : (
               <div className="divide-y divide-gray-200">
                  {paginatedThreads.map((thread) => {
                     // The course is now nested in the thread object
                     const course = thread.course;
                     const semester = semesters.find((s) => s.id === thread.semester_id);

                     return (
                        <div key={thread.id} className="p-6 hover:bg-gray-50">
                           <div className="flex justify-between items-start">
                              <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                    <div>
                                       {/* Thread Title */}
                                       <h3 className="text-lg font-sf-regular text-gray-900 mb-1">{thread.title}</h3>

                                       {/* Course Info */}
                                       <div className="flex items-center text-sm text-gray-600 mb-2">
                                          <FiBook className="mr-1" />
                                          <span>{course ? course.title : "Unknown Course"}</span>
                                       </div>

                                       {/* Semester Info */}
                                       <div className="flex items-center text-sm text-gray-600 mb-2">
                                          <FiCalendar className="mr-1" />
                                          <span>{semester ? semester.name : `Semester #${thread.semester_id}`}</span>
                                       </div>

                                       {/* Created At */}
                                       <div className="flex items-center text-xs text-gray-500 mb-4">
                                          <span>Created: {formatTimestamp(thread.created_at)}</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Teacher */}
                                 <div className="mt-4">
                                    <h4 className="text-sm font-sf-regular text-gray-700 mb-2">Teacher:</h4>
                                    {thread.teacher ? (
                                       <div className="flex items-center">
                                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                                             {thread.teacher.name ? thread.teacher.name.charAt(0) : "?"}
                                          </div>
                                          <div className="ml-2">
                                             <div className="text-sm font-sf-regular text-gray-900">
                                                {thread.teacher.name || "Unknown"} {thread.teacher.surname || ""}
                                             </div>
                                             <div className="text-xs text-gray-500">{thread.teacher.email || "No email"}</div>
                                          </div>
                                       </div>
                                    ) : (
                                       <div className="text-sm text-gray-500">No teacher assigned</div>
                                    )}
                                 </div>

                                 {/* Max Students */}
                                 <div className="mt-4">
                                    <div className="flex items-center mb-2">
                                       <h4 className="text-sm font-sf-regular text-gray-700">Max Students:</h4>
                                       <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                          {thread.max_students || "Unlimited"}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Syllabus URL */}
                                 {thread.syllabus_url && (
                                    <div className="mt-4">
                                       <h4 className="text-sm font-sf-regular text-gray-700 mb-2">Syllabus:</h4>
                                       <a
                                          href={thread.syllabus_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                                       >
                                          <FiBook className="mr-1" />
                                          View Syllabus
                                       </a>
                                    </div>
                                 )}
                              </div>

                              <div className="flex space-x-2">
                                 <button
                                    className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md border border-green-200 flex items-center"
                                    onClick={() => handleOpenDetailsModal(thread)}
                                 >
                                    <FiList className="mr-1" size={14} /> Manage
                                 </button>
                                 <button
                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 flex items-center"
                                    onClick={() => handleOpenEditModal(thread)}
                                 >
                                    <FiEdit className="mr-1" size={14} /> Edit
                                 </button>
                                 <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200 flex items-center">
                                    <FiTrash2 className="mr-1" size={14} /> Delete
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
         {calculatedTotalPages > 1 && (
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

                  {[...Array(calculatedTotalPages).keys()].map((page) => (
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
                     disabled={currentPage === calculatedTotalPages}
                     className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === calculatedTotalPages
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

         {/* Edit Thread Modal */}
         <EditThreadModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateThread}
            thread={selectedThread}
            courses={courses}
            semesters={semesters}
            teachers={teachers}
         />

         {/* Create Thread Modal */}
         <CreateThreadModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSubmit={handleCreateThread}
            courses={courses}
            semesters={semesters}
            teachers={teachers}
         />

         {/* Thread Details Modal */}
         <ThreadDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={handleCloseDetailsModal}
            thread={selectedThreadForDetails}
            course={selectedThreadForDetails ? courses.find((c) => c.id === selectedThreadForDetails.course_id) : null}
            semester={selectedThreadForDetails ? semesters.find((s) => s.id === selectedThreadForDetails.semester_id) : null}
            teacher={selectedThreadForDetails ? teachers.find((t) => t.id === selectedThreadForDetails.teacher_id) : null}
         />
      </div>
   );
};

export default Threads;
