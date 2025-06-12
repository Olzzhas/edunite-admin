import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAvailableCourses } from "../store/slices/degreeCourseSlice";
import { FiSearch, FiBook, FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";

// Function to get the correct image URL
const getImageUrl = (imagePath) => {
   if (!imagePath) return "https://via.placeholder.com/800x200?text=No+Image";

   // If it's already a full URL, return it as is
   if (imagePath.startsWith("http")) return imagePath;

   // Get the API URL from environment or default
   const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

   // Construct the storage URL
   return `${API_URL}/storage/photo/${imagePath}`;
};

const StudentCourses = ({ studentId }) => {
   const dispatch = useDispatch();
   const { studentAvailableCourses, loading, error } = useSelector((state) => state.degreeCourses);
   const { addToast } = useToast();

   const [searchTerm, setSearchTerm] = useState("");
   const [filteredCourses, setFilteredCourses] = useState([]);

   useEffect(() => {
      if (studentId) {
         dispatch(fetchStudentAvailableCourses(studentId));
      }
   }, [dispatch, studentId]);

   useEffect(() => {
      // Filter courses based on search term
      if (searchTerm.trim() === "") {
         setFilteredCourses(studentAvailableCourses);
      } else {
         const filtered = studentAvailableCourses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredCourses(filtered);
      }
   }, [studentAvailableCourses, searchTerm]);

   const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by useEffect above
   };

   const handleCourseRegister = async (courseId, courseTitle) => {
      try {
         // TODO: Implement course registration API call
         console.log(`Registering for course ${courseId}: ${courseTitle}`);
         addToast(`Регистрация на курс "${courseTitle}" успешна!`, "success");
      } catch (error) {
         console.error("Error registering for course:", error);
         addToast("Ошибка при регистрации на курс", "error");
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-center py-12">
            <div className="text-red-500 mb-4">Ошибка загрузки курсов</div>
            <p className="text-gray-600">{error}</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900">Доступные курсы</h1>
               <p className="text-gray-600 mt-1">Курсы вашей программы обучения</p>
            </div>
         </div>

         {/* Search */}
         <div className="bg-white p-4 rounded-lg shadow-sm border">
            <form onSubmit={handleSearch} className="flex gap-4">
               <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <FiSearch className="text-gray-400" />
                  </div>
                  <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     placeholder="Поиск курсов..."
                  />
               </div>
               <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
               >
                  Поиск
               </button>
            </form>
         </div>

         {/* Courses Grid */}
         {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
               <FiBook size={48} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Курсы не найдены" : "Нет доступных курсов"}
               </h3>
               <p className="text-gray-600">
                  {searchTerm 
                     ? "Попробуйте изменить поисковый запрос" 
                     : "В вашей программе обучения пока нет курсов"
                  }
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCourses.map((course) => (
                  <div
                     key={course.id}
                     className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  >
                     {/* Course Image */}
                     <div
                        className="h-48 bg-cover bg-center"
                        style={{
                           backgroundImage: `url(${getImageUrl(course.banner_image_url)})`,
                        }}
                     >
                        <div className="h-full bg-black bg-opacity-20 flex items-end">
                           <div className="p-4 text-white">
                              <h3 className="text-lg font-semibold">{course.title}</h3>
                           </div>
                        </div>
                     </div>

                     {/* Course Content */}
                     <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                           {course.description || "Описание курса отсутствует"}
                        </p>

                        {/* Course Meta */}
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center text-sm text-gray-500">
                              <FiCalendar size={14} className="mr-2" />
                              <span>Создан: {formatTimestamp(course.created_at)}</span>
                           </div>
                           <div className="flex items-center text-sm text-gray-500">
                              <FiClock size={14} className="mr-2" />
                              <span>Обновлен: {formatTimestamp(course.updated_at)}</span>
                           </div>
                        </div>

                        {/* Action Button */}
                        <button
                           onClick={() => handleCourseRegister(course.id, course.title)}
                           className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <FiUser size={16} />
                           Записаться на курс
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Results Summary */}
         {filteredCourses.length > 0 && (
            <div className="text-center text-sm text-gray-500">
               Показано {filteredCourses.length} из {studentAvailableCourses.length} курсов
            </div>
         )}
      </div>
   );
};

export default StudentCourses;
