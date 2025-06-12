import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAvailableCourses } from "../store/slices/degreeCourseSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { FiUser, FiBook, FiRefreshCw } from "react-icons/fi";
import { useToast } from "../contexts/ToastContext";
import StudentCourses from "./StudentCourses";

const StudentCoursesTest = () => {
   const dispatch = useDispatch();
   const { users } = useSelector((state) => state.users);
   const { studentAvailableCourses, loading, error } = useSelector((state) => state.degreeCourses);
   const { addToast } = useToast();

   const [selectedStudentId, setSelectedStudentId] = useState("");
   const [showCourses, setShowCourses] = useState(false);

   // Get students from users
   const students = users ? users.filter((user) => user.role === "student") : [];

   useEffect(() => {
      dispatch(fetchUsers({ page: 1, size: 100 }));
   }, [dispatch]);

   const handleStudentChange = (e) => {
      const studentId = e.target.value;
      setSelectedStudentId(studentId);
      setShowCourses(false);
   };

   const handleLoadCourses = () => {
      if (!selectedStudentId) {
         addToast("Пожалуйста, выберите студента", "warning");
         return;
      }
      setShowCourses(true);
   };

   const handleRefresh = () => {
      if (selectedStudentId) {
         dispatch(fetchStudentAvailableCourses(selectedStudentId));
      }
   };

   const selectedStudent = students.find(student => student.id === parseInt(selectedStudentId));

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-semibold text-gray-900">Тест курсов студентов</h1>
               <p className="text-gray-600 mt-1">Тестирование функциональности доступных курсов для студентов</p>
            </div>
         </div>

         {/* Student Selection */}
         <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
               <FiUser size={20} />
               Выбор студента
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                     Студент
                  </label>
                  <select
                     id="student_id"
                     value={selectedStudentId}
                     onChange={handleStudentChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     <option value="">Выберите студента</option>
                     {students.map((student) => (
                        <option key={student.id} value={student.id}>
                           {student.name} {student.surname} ({student.email})
                        </option>
                     ))}
                  </select>
                  {students.length === 0 && (
                     <p className="text-sm text-gray-500 mt-1">
                        Студенты не найдены. Убедитесь, что в системе есть пользователи с ролью "student".
                     </p>
                  )}
               </div>

               {selectedStudent && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <h4 className="font-medium text-gray-900 mb-2">Выбранный студент:</h4>
                     <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Имя:</strong> {selectedStudent.name} {selectedStudent.surname}</p>
                        <p><strong>Email:</strong> {selectedStudent.email}</p>
                        <p><strong>Роль:</strong> {selectedStudent.role}</p>
                        <p><strong>ID:</strong> {selectedStudent.id}</p>
                     </div>
                  </div>
               )}

               <div className="flex gap-3">
                  <button
                     onClick={handleLoadCourses}
                     disabled={!selectedStudentId}
                     className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                     <FiBook size={16} />
                     Загрузить курсы
                  </button>
                  
                  {showCourses && (
                     <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                     >
                        <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Обновить
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* API Response Info */}
         {showCourses && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Информация об API</h3>
               
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-gray-700">Статус:</span>
                     <span className={`text-sm px-2 py-1 rounded ${
                        loading ? "bg-yellow-100 text-yellow-800" : 
                        error ? "bg-red-100 text-red-800" : 
                        "bg-green-100 text-green-800"
                     }`}>
                        {loading ? "Загрузка..." : error ? "Ошибка" : "Успешно"}
                     </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-gray-700">Эндпоинт:</span>
                     <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        GET /students/{selectedStudentId}/available-courses
                     </code>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-gray-700">Количество курсов:</span>
                     <span className="text-sm text-gray-600">
                        {studentAvailableCourses ? studentAvailableCourses.length : 0}
                     </span>
                  </div>

                  {error && (
                     <div className="mt-3">
                        <span className="text-sm font-medium text-red-700">Ошибка:</span>
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-1">
                           {error}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* Student Courses Component */}
         {showCourses && selectedStudentId && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Курсы студента</h3>
               <StudentCourses studentId={selectedStudentId} />
            </div>
         )}
      </div>
   );
};

export default StudentCoursesTest;
