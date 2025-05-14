import { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";

const CreateThreadModal = ({ isOpen, onClose, onSubmit, courses, semesters, teachers, locations }) => {
   const [threadData, setThreadData] = useState({
      title: "",
      description: "",
      course_id: "",
      semester_id: "",
      teacher_id: "",
      max_students: "30",
      schedules: [
         {
            day_of_week: 1, // Monday
            start_time: "09:00:00",
            end_time: "10:30:00",
            location: "",
         },
      ],
   });
   const [errors, setErrors] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Reset form when modal is opened/closed
   const resetForm = () => {
      setThreadData({
         title: "",
         description: "",
         course_id: "",
         semester_id: "",
         teacher_id: "",
         max_students: "30",
         schedules: [
            {
               day_of_week: 1, // Monday
               start_time: "09:00:00",
               end_time: "10:30:00",
               location: "",
            },
         ],
      });
      setErrors({});
      setIsSubmitting(false);
   };

   // Handle input changes
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setThreadData((prev) => ({
         ...prev,
         [name]: value,
      }));
      // Clear error when field is edited
      if (errors[name]) {
         setErrors((prev) => ({
            ...prev,
            [name]: null,
         }));
      }
   };

   const handleScheduleChange = (index, field, value) => {
      const updatedSchedules = [...threadData.schedules];
      updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };

      setThreadData((prev) => ({ ...prev, schedules: updatedSchedules }));

      // Clear schedule errors
      if (errors[`schedules.${index}.${field}`]) {
         setErrors((prev) => ({ ...prev, [`schedules.${index}.${field}`]: null }));
      }
   };

   const addSchedule = () => {
      setThreadData((prev) => ({
         ...prev,
         schedules: [
            ...prev.schedules,
            {
               day_of_week: 1,
               start_time: "09:00:00",
               end_time: "10:30:00",
               location: "",
            },
         ],
      }));
   };

   const removeSchedule = (index) => {
      if (threadData.schedules.length <= 1) {
         return; // Keep at least one schedule
      }

      const updatedSchedules = threadData.schedules.filter((_, i) => i !== index);
      setThreadData((prev) => ({ ...prev, schedules: updatedSchedules }));

      // Clear any errors for this schedule
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
         if (key.startsWith(`schedules.${index}.`)) {
            delete newErrors[key];
         }
      });
      setErrors(newErrors);
   };

   const validateForm = () => {
      const newErrors = {};

      if (!threadData.title.trim()) {
         newErrors.title = "Thread title is required";
      }

      if (!threadData.description.trim()) {
         newErrors.description = "Description is required";
      }

      if (!threadData.course_id) {
         newErrors.course_id = "Course is required";
      }

      if (!threadData.semester_id) {
         newErrors.semester_id = "Semester is required";
      }

      if (!threadData.teacher_id) {
         newErrors.teacher_id = "Teacher is required";
      }

      // Validate each schedule
      threadData.schedules.forEach((schedule, index) => {
         if (!schedule.start_time) {
            newErrors[`schedules.${index}.start_time`] = "Start time is required";
         }

         if (!schedule.end_time) {
            newErrors[`schedules.${index}.end_time`] = "End time is required";
         }

         if (!schedule.location) {
            newErrors[`schedules.${index}.location`] = "Location is required";
         }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
         // Format data for API
         const formattedData = {
            title: String(threadData.title.trim()),
            description: String(threadData.description.trim()),
            course_id: Number(threadData.course_id),
            semester_id: Number(threadData.semester_id),
            teacher_id: Number(threadData.teacher_id),
            max_students: Number(threadData.max_students || 30),
            schedules: threadData.schedules.map((schedule) => ({
               day_of_week: Number(schedule.day_of_week),
               start_time: String(schedule.start_time),
               end_time: String(schedule.end_time),
               location: String(schedule.location),
            })),
         };

         // Submit form data
         await onSubmit(formattedData);

         // Close modal and reset form on success
         resetForm();
         onClose();
      } catch (error) {
         console.error("Error creating thread:", error);
         setErrors((prev) => ({
            ...prev,
            form: error.message || "Failed to create thread. Please try again.",
         }));
      } finally {
         setIsSubmitting(false);
      }
   };

   // Handle modal close
   const handleClose = () => {
      resetForm();
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
               &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">Create New Thread</h3>
                     <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={handleClose}>
                        <FiX size={24} />
                     </button>
                  </div>

                  {/* Form-level error message */}
                  {errors.form && (
                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                           <FiAlertCircle className="text-red-500 mr-2" />
                           <span className="text-red-700">{errors.form}</span>
                        </div>
                     </div>
                  )}

                  <form onSubmit={handleSubmit}>
                     {/* Title */}
                     <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                           Title <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           id="title"
                           name="title"
                           value={threadData.title}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.title ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           placeholder="Enter thread title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                     </div>

                     {/* Description */}
                     <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                           Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                           id="description"
                           name="description"
                           value={threadData.description}
                           onChange={handleInputChange}
                           rows="2"
                           className={`block w-full px-3 py-2 border ${
                              errors.description ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           placeholder="Enter thread description"
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                     </div>

                     {/* Course */}
                     <div className="mb-4">
                        <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
                           Course <span className="text-red-500">*</span>
                        </label>
                        <select
                           id="course_id"
                           name="course_id"
                           value={threadData.course_id}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.course_id ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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

                     {/* Semester */}
                     <div className="mb-4">
                        <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-1">
                           Semester <span className="text-red-500">*</span>
                        </label>
                        <select
                           id="semester_id"
                           name="semester_id"
                           value={threadData.semester_id}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.semester_id ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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

                     {/* Teacher */}
                     <div className="mb-4">
                        <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                           Teacher <span className="text-red-500">*</span>
                        </label>
                        <select
                           id="teacher_id"
                           name="teacher_id"
                           value={threadData.teacher_id}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.teacher_id ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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

                     {/* Max Students */}
                     <div className="mb-4">
                        <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-1">
                           Max Students
                        </label>
                        <input
                           type="number"
                           id="max_students"
                           name="max_students"
                           value={threadData.max_students}
                           onChange={handleInputChange}
                           min="1"
                           className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                           placeholder="30"
                        />
                     </div>

                     {/* Schedules */}
                     <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                           <label className="block text-sm font-medium text-gray-700">
                              Schedules <span className="text-red-500">*</span>
                           </label>
                           <button
                              type="button"
                              onClick={addSchedule}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                           >
                              <FiPlus className="mr-1" /> Add Schedule
                           </button>
                        </div>

                        {threadData.schedules.map((schedule, index) => (
                           <div key={index} className="border rounded-md p-3 mb-3 bg-gray-50">
                              <div className="flex justify-between items-center mb-2">
                                 <h4 className="text-sm font-medium">Schedule #{index + 1}</h4>
                                 <button
                                    type="button"
                                    onClick={() => removeSchedule(index)}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    disabled={threadData.schedules.length <= 1}
                                 >
                                    <FiTrash2 size={16} />
                                 </button>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
                                    <select
                                       value={schedule.day_of_week}
                                       onChange={(e) => handleScheduleChange(index, "day_of_week", e.target.value)}
                                       className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-xs"
                                    >
                                       <option value={1}>Monday</option>
                                       <option value={2}>Tuesday</option>
                                       <option value={3}>Wednesday</option>
                                       <option value={4}>Thursday</option>
                                       <option value={5}>Friday</option>
                                       <option value={6}>Saturday</option>
                                       <option value={7}>Sunday</option>
                                    </select>
                                 </div>

                                 <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                    <select
                                       value={schedule.location}
                                       onChange={(e) => handleScheduleChange(index, "location", e.target.value)}
                                       className={`block w-full px-3 py-2 border ${
                                          errors[`schedules.${index}.location`] ? "border-red-300" : "border-gray-300"
                                       } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-xs`}
                                    >
                                       <option value="">Select a location</option>
                                       {locations &&
                                          locations.map((location) => (
                                             <option key={location.id} value={location.name}>
                                                {location.name} (Capacity: {location.capacity})
                                             </option>
                                          ))}
                                    </select>
                                    {errors[`schedules.${index}.location`] && (
                                       <p className="mt-1 text-xs text-red-600">{errors[`schedules.${index}.location`]}</p>
                                    )}
                                 </div>

                                 <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                       type="time"
                                       value={schedule.start_time.substring(0, 5)}
                                       onChange={(e) => handleScheduleChange(index, "start_time", `${e.target.value}:00`)}
                                       className={`block w-full px-3 py-2 border ${
                                          errors[`schedules.${index}.start_time`] ? "border-red-300" : "border-gray-300"
                                       } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-xs`}
                                    />
                                    {errors[`schedules.${index}.start_time`] && (
                                       <p className="mt-1 text-xs text-red-600">{errors[`schedules.${index}.start_time`]}</p>
                                    )}
                                 </div>

                                 <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                       type="time"
                                       value={schedule.end_time.substring(0, 5)}
                                       onChange={(e) => handleScheduleChange(index, "end_time", `${e.target.value}:00`)}
                                       className={`block w-full px-3 py-2 border ${
                                          errors[`schedules.${index}.end_time`] ? "border-red-300" : "border-gray-300"
                                       } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-xs`}
                                    />
                                    {errors[`schedules.${index}.end_time`] && (
                                       <p className="mt-1 text-xs text-red-600">{errors[`schedules.${index}.end_time`]}</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Submit Button */}
                     <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? "Creating..." : "Create Thread"}
                        </button>
                        <button
                           type="button"
                           onClick={handleClose}
                           disabled={isSubmitting}
                           className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CreateThreadModal;
