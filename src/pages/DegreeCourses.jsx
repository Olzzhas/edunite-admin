import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeCourses, removeCourseFromDegree } from "../store/slices/degreeCourseSlice";
import { fetchDegrees } from "../store/slices/degreeSlice";
import { fetchCourses } from "../store/slices/courseSlice";
import { FiPlus, FiTrash2, FiBook, FiUsers, FiFilter } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { useAlertDialog } from "../contexts/AlertDialogContext";
import AddCourseToDegreModal from "../components/modals/AddCourseToDegreModal";

const DegreeCourses = () => {
   const dispatch = useDispatch();
   const { degreeCoursesMap, loading, error } = useSelector((state) => state.degreeCourses);
   const { degrees } = useSelector((state) => state.degrees);
   const { courses } = useSelector((state) => state.courses);
   const { addToast } = useToast();
   const { showAlert } = useAlertDialog();

   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [selectedDegreeId, setSelectedDegreeId] = useState("");
   const [filters, setFilters] = useState({
      degree_id: "",
   });

   useEffect(() => {
      dispatch(fetchDegrees({ page: 1, pageSize: 100 }));
      dispatch(fetchCourses({ page: 0, size: 100 }));
   }, [dispatch]);

   useEffect(() => {
      if (selectedDegreeId) {
         dispatch(fetchDegreeCourses(selectedDegreeId));
      }
   }, [dispatch, selectedDegreeId]);

   const handleDegreeChange = (e) => {
      const degreeId = e.target.value;
      setSelectedDegreeId(degreeId);
      setFilters((prev) => ({ ...prev, degree_id: degreeId }));
   };

   const handleAddCourse = () => {
      if (!selectedDegreeId) {
         addToast("Пожалуйста, выберите программу обучения", "warning");
         return;
      }
      setIsAddModalOpen(true);
   };

   const handleRemoveCourse = async (courseId, courseTitle) => {
      if (!selectedDegreeId) return;

      const confirmed = await showAlert({
         title: "Удалить курс из программы",
         message: `Вы уверены, что хотите удалить курс "${courseTitle}" из программы?`,
         type: "delete",
         confirmText: "Удалить",
         cancelText: "Отмена",
      });

      if (confirmed) {
         try {
            await dispatch(removeCourseFromDegree({ degreeId: selectedDegreeId, courseId })).unwrap();
            addToast("Курс успешно удален из программы", "success");
         } catch (error) {
            console.error("Error removing course from degree:", error);
            addToast("Ошибка при удалении курса из программы", "error");
         }
      }
   };

   const handleCloseAddModal = () => {
      setIsAddModalOpen(false);
   };

   const selectedDegree = degrees?.find((degree) => degree.id === parseInt(selectedDegreeId));
   const degreeCourses = selectedDegreeId ? degreeCoursesMap[selectedDegreeId] || [] : [];

   // Get available courses (courses not yet added to the selected degree)
   const availableCourses =
      courses?.filter((course) => !degreeCourses.some((degreeCourse) => degreeCourse.id === course.id)) || [];

   if (loading && !degreeCourses.length) {
      return (
         <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900">Курсы программ</h1>
               <p className="text-gray-600 mt-1">Управление курсами в программах обучения</p>
            </div>
         </div>

         {/* Filters */}
         <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
               <FiFilter className="text-gray-400" size={20} />
               <div className="flex-1">
                  <label htmlFor="degree_id" className="block text-sm font-medium text-gray-700 mb-1">
                     Программа обучения
                  </label>
                  <select
                     id="degree_id"
                     name="degree_id"
                     value={selectedDegreeId}
                     onChange={handleDegreeChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     <option value="">Выберите программу обучения</option>
                     {degrees?.map((degree) => (
                        <option key={degree.id} value={degree.id}>
                           {degree.name} ({degree.level})
                        </option>
                     ))}
                  </select>
               </div>
            </div>
         </div>

         {/* Selected Degree Info */}
         {selectedDegree && (
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-medium text-primary-900">{selectedDegree.name}</h3>
                     <p className="text-primary-700">
                        {selectedDegree.level} • {selectedDegree.duration_years} лет
                     </p>
                     {selectedDegree.description && <p className="text-primary-600 mt-1">{selectedDegree.description}</p>}
                  </div>
                  <button
                     onClick={handleAddCourse}
                     className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                     <FiPlus size={16} />
                     Добавить курс
                  </button>
               </div>
            </div>
         )}

         {/* Courses List */}
         {selectedDegreeId && (
            <div className="bg-white rounded-lg shadow-sm border">
               <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                     <FiBook size={20} />
                     Курсы программы ({degreeCourses.length})
                  </h3>
               </div>

               {degreeCourses.length === 0 ? (
                  <div className="p-8 text-center">
                     <FiBook size={48} className="mx-auto text-gray-300 mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">Нет курсов</h3>
                     <p className="text-gray-600 mb-4">В этой программе пока нет курсов</p>
                     <button
                        onClick={handleAddCourse}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
                     >
                        <FiPlus size={16} />
                        Добавить первый курс
                     </button>
                  </div>
               ) : (
                  <div className="divide-y">
                     {degreeCourses.map((course) => (
                        <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                           <div className="flex items-center justify-between">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3">
                                    {course.banner_image_url ? (
                                       <img
                                          src={`${import.meta.env.VITE_API_BASE_URL}/storage/photo/${course.banner_image_url}`}
                                          alt={course.title}
                                          className="w-12 h-12 rounded-lg object-cover"
                                       />
                                    ) : (
                                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                          <FiBook className="text-gray-400" size={20} />
                                       </div>
                                    )}
                                    <div>
                                       <h4 className="font-medium text-gray-900">{course.title}</h4>
                                       {course.description && <p className="text-sm text-gray-600 mt-1">{course.description}</p>}
                                       <p className="text-xs text-gray-500 mt-1">Создан: {formatTimestamp(course.created_at)}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button
                                    onClick={() => handleRemoveCourse(course.id, course.title)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Удалить курс из программы"
                                 >
                                    <FiTrash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {!selectedDegreeId && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
               <FiUsers size={48} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите программу обучения</h3>
               <p className="text-gray-600">Выберите программу обучения выше, чтобы управлять её курсами</p>
            </div>
         )}

         {/* Add Course Modal */}
         <AddCourseToDegreModal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            degreeId={selectedDegreeId}
            availableCourses={availableCourses}
         />
      </div>
   );
};

export default DegreeCourses;
