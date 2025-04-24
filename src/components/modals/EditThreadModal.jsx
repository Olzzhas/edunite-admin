import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const EditThreadModal = ({ isOpen, onClose, onSubmit, thread, courses, semesters, teachers }) => {
  const [threadData, setThreadData] = useState({
    title: '',
    description: '', // This is required according to the API error
    course_id: '',
    semester_id: '',
    teacher_id: '',
    max_students: '',
  });
  const [errors, setErrors] = useState({});

  // Initialize form with thread data when it changes
  useEffect(() => {
    if (thread) {
      console.log('Initializing form with thread data:', thread);
      setThreadData({
        title: thread.title || '',
        description: thread.description || '', // Ensure description is initialized
        course_id: thread.course_id?.toString() || '',
        semester_id: thread.semester_id?.toString() || '',
        teacher_id: thread.teacher_id?.toString() || '',
        max_students: thread.max_students?.toString() || '',
      });
    }
  }, [thread]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setThreadData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!threadData.title.trim()) {
      newErrors.title = 'Thread title is required';
    }

    if (!threadData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!threadData.course_id) {
      newErrors.course_id = 'Course is required';
    }

    if (!threadData.semester_id) {
      newErrors.semester_id = 'Semester is required';
    }

    if (!threadData.teacher_id) {
      newErrors.teacher_id = 'Teacher is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Format data for API
      const formattedData = {
        ...threadData,
        course_id: parseInt(threadData.course_id),
        semester_id: parseInt(threadData.semester_id),
        teacher_id: parseInt(threadData.teacher_id),
        max_students: threadData.max_students ? parseInt(threadData.max_students) : 0,
      };

      onSubmit(thread.id, formattedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Thread</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Thread Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={threadData.title}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter thread title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={threadData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.description ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter thread description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="course_id"
                  name="course_id"
                  value={threadData.course_id}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.course_id ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  id="semester_id"
                  name="semester_id"
                  value={threadData.semester_id}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.semester_id ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a semester</option>
                  {semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
                {errors.semester_id && <p className="mt-1 text-sm text-red-600">{errors.semester_id}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={threadData.teacher_id}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.teacher_id ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} {teacher.surname}
                    </option>
                  ))}
                </select>
                {errors.teacher_id && <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  id="max_students"
                  name="max_students"
                  value={threadData.max_students}
                  onChange={handleChange}
                  min="0"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter maximum number of students"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty or set to 0 for unlimited students</p>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                >
                  Update Thread
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditThreadModal;
