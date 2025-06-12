import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCourseToDegree, fetchDegreeCourses } from "../../store/slices/degreeCourseSlice";
import { FiX, FiBook } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";

const AddCourseToDegreModal = ({ isOpen, onClose, degreeId, availableCourses }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    is_required: false,
    semester_number: 1,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.course_id) {
      addToast("Пожалуйста, выберите курс", "warning");
      return;
    }

    setLoading(true);
    try {
      const degreeCourseData = {
        degree_id: parseInt(degreeId),
        course_id: parseInt(formData.course_id),
        is_required: formData.is_required,
        semester_number: parseInt(formData.semester_number),
      };

      await dispatch(addCourseToDegree(degreeCourseData)).unwrap();
      
      // Refresh the degree courses list
      await dispatch(fetchDegreeCourses(degreeId));
      
      addToast("Курс успешно добавлен к программе", "success");
      handleClose();
    } catch (error) {
      console.error("Error adding course to degree:", error);
      addToast("Ошибка при добавлении курса к программе", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: "",
      is_required: false,
      semester_number: 1,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Добавить курс к программе</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course Selection */}
          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
              Курс *
            </label>
            <select
              id="course_id"
              name="course_id"
              value={formData.course_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Выберите курс</option>
              {availableCourses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {availableCourses?.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Все доступные курсы уже добавлены к этой программе
              </p>
            )}
          </div>

          {/* Semester Number */}
          <div>
            <label htmlFor="semester_number" className="block text-sm font-medium text-gray-700 mb-1">
              Семестр
            </label>
            <input
              type="number"
              id="semester_number"
              name="semester_number"
              value={formData.semester_number}
              onChange={handleInputChange}
              min="1"
              max="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              В каком семестре должен изучаться этот курс
            </p>
          </div>

          {/* Is Required */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_required"
              name="is_required"
              checked={formData.is_required}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_required" className="ml-2 block text-sm text-gray-700">
              Обязательный курс
            </label>
          </div>

          {/* Selected Course Preview */}
          {formData.course_id && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Выбранный курс:</h4>
              {(() => {
                const selectedCourse = availableCourses?.find(course => course.id === parseInt(formData.course_id));
                return selectedCourse ? (
                  <div className="flex items-center gap-3">
                    {selectedCourse.banner_image_url ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}/storage/photo/${selectedCourse.banner_image_url}`}
                        alt={selectedCourse.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FiBook className="text-gray-400" size={16} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{selectedCourse.title}</p>
                      {selectedCourse.description && (
                        <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !formData.course_id || availableCourses?.length === 0}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Добавление..." : "Добавить курс"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseToDegreModal;
