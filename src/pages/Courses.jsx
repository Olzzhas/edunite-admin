import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../store/slices/courseSlice";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import apiClient from "../services/api/apiClient";
import AddCourseModal from "../components/modals/AddCourseModal";
import EditCourseModal from "../components/modals/EditCourseModal";
import { useToast } from "../contexts/ToastContext";

// Function to get the correct image URL
const getImageUrl = (imagePath) => {
   if (!imagePath) return "https://via.placeholder.com/800x200?text=No+Image";

   // If it's already a full URL, return it as is
   if (imagePath.startsWith("http")) return imagePath;

   // Get the API URL from apiClient
   const API_URL = apiClient.defaults.baseURL || "http://localhost:8081";

   // Construct the storage URL
   return `${API_URL}/storage/photo/${imagePath}`;
};

const Courses = () => {
   const dispatch = useDispatch();
   const { courses, totalElements, totalPages, currentPage, pageSize, loading, error } = useSelector((state) => state.courses);
   const { addToast } = useToast();

   const [searchTerm, setSearchTerm] = useState("");
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedCourse, setSelectedCourse] = useState(null);

   // Track current page in component state
   const [currentPageState, setCurrentPageState] = useState(1);

   // Debug pagination values
   useEffect(() => {
      console.log("Courses pagination values:", { totalElements, totalPages, pageSize, currentPage });
   }, [totalElements, totalPages, pageSize, currentPage]);

   useEffect(() => {
      dispatch(fetchCourses({ page: 1, size: 10 }));
   }, [dispatch]);

   const handlePageChange = (page) => {
      console.log(`Changing to page ${page}`);
      setCurrentPageState(page);
      dispatch(fetchCourses({ page, size: pageSize }));
   };

   const handleSearch = (e) => {
      e.preventDefault();
      console.log("Searching for courses with term:", searchTerm);
      // Reset to page 1 when searching
      setCurrentPageState(1);
      // In a real implementation, we would pass the search term to the API
      dispatch(fetchCourses({ page: 1, size: pageSize }));
   };

   // Handle opening the add course modal
   const handleOpenAddModal = () => {
      setIsAddModalOpen(true);
   };

   // Handle closing the add course modal
   const handleCloseAddModal = () => {
      setIsAddModalOpen(false);
   };

   // Handle opening the edit course modal
   const handleOpenEditModal = (course) => {
      setSelectedCourse(course);
      setIsEditModalOpen(true);
   };

   // Handle closing the edit course modal
   const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedCourse(null);
   };

   // Handle adding a new course
   const handleAddCourse = async (formData) => {
      try {
         // Make API call to add course with image
         const response = await apiClient.post("/course/with-image", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         console.log("Course added successfully:", response.data);

         // Show success message
         addToast("Course added successfully!", "success", 3000);

         // Refresh the courses list
         dispatch(fetchCourses({ page: currentPageState, size: pageSize }));

         return response.data;
      } catch (error) {
         console.error("Error adding course:", error);

         // Show error message
         addToast("Failed to add course: " + (error.response?.data?.message || error.message), "error", 5000);

         throw error;
      }
   };

   // Handle updating a course
   const handleUpdateCourse = async (courseId, formData) => {
      try {
         // Make API call to update course with image
         const response = await apiClient.put(`/course/${courseId}/with-image`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         console.log("Course updated successfully:", response.data);

         // Show success message
         addToast("Course updated successfully!", "success", 3000);

         // Refresh the courses list
         dispatch(fetchCourses({ page: currentPageState, size: pageSize }));

         return response.data;
      } catch (error) {
         console.error("Error updating course:", error);

         // Show error message
         addToast("Failed to update course: " + (error.response?.data?.message || error.message), "error", 5000);

         throw error;
      }
   };

   return (
      <div className="p-4">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-medium">Courses</h1>
            <button
               onClick={handleOpenAddModal}
               className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 flex items-center text-sm"
            >
               <FiPlus className="mr-1" /> Add Course
            </button>
         </div>

         {/* Search */}
         <div className="flex mb-4">
            <div className="flex-1 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
               </div>
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search courses..."
               />
            </div>
            <button
               onClick={handleSearch}
               className="bg-primary-600 text-white px-4 py-2 rounded-r-md border border-primary-700 hover:bg-primary-700 text-sm"
            >
               Search
            </button>
         </div>

         {/* Courses Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
               <div className="col-span-full flex justify-center py-12">
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
               <div className="col-span-full text-center py-12 text-red-500">{error}</div>
            ) : courses == null || courses.length === 0 ? (
               <div className="col-span-full text-center py-12">No courses found</div>
            ) : (
               courses.map((course) => (
                  <div
                     key={course.id}
                     className="bg-white rounded-md border border-gray-200 overflow-hidden w-full hover:shadow-sm transition-all duration-300"
                  >
                     <div
                        className="h-36 bg-cover bg-center"
                        style={{
                           backgroundImage: `url(${getImageUrl(course.banner_image_url || course.bannerImageUrl)})`,
                        }}
                     ></div>
                     <div className="p-3 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                           {course.description || "This course provides a comprehensive introduction..."}
                        </p>
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-gray-500">Created: {formatTimestamp(course.created_at)}</span>
                           <div className="flex space-x-1">
                              <button
                                 onClick={() => handleOpenEditModal(course)}
                                 className="p-1 text-gray-500 hover:text-blue-600"
                              >
                                 <FiEdit size={14} />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-red-600">
                                 <FiTrash2 size={14} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Pagination */}
         {totalElements > 0 && (
            <div className="mt-6 flex items-center justify-center">
               <nav className="flex items-center space-x-1" aria-label="Pagination">
                  <button
                     onClick={() => handlePageChange(Math.max(1, currentPageState - 1))}
                     disabled={currentPageState <= 1}
                     className={`relative inline-flex items-center justify-center w-8 h-8 rounded border ${
                        currentPageState <= 1
                           ? "text-gray-300 border-gray-200 cursor-not-allowed"
                           : "text-gray-500 border-gray-300 hover:bg-gray-50"
                     }`}
                  >
                     <span className="sr-only">Previous</span>
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M10 12L6 8L10 4"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </button>

                  {(totalPages > 0 ? [...Array(Math.min(totalPages, 5)).keys()] : [0]).map((page) => (
                     <button
                        key={page}
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative inline-flex items-center justify-center w-8 h-8 rounded border text-sm ${
                           currentPageState === page + 1
                              ? "bg-primary-50 border-primary-500 text-primary-600 font-medium"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                     >
                        {page + 1}
                     </button>
                  ))}

                  <button
                     onClick={() => handlePageChange(currentPageState + 1)}
                     disabled={currentPageState >= totalPages}
                     className={`relative inline-flex items-center justify-center w-8 h-8 rounded border ${
                        currentPageState >= totalPages
                           ? "text-gray-300 border-gray-200 cursor-not-allowed"
                           : "text-gray-500 border-gray-300 hover:bg-gray-50"
                     }`}
                  >
                     <span className="sr-only">Next</span>
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M6 4L10 8L6 12"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </button>
               </nav>
            </div>
         )}

         {/* Add Course Modal */}
         <AddCourseModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={handleAddCourse} />

         {/* Edit Course Modal */}
         <EditCourseModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateCourse}
            course={selectedCourse}
         />
      </div>
   );
};

export default Courses;
