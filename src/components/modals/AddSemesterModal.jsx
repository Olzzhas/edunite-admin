import { useState } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

const AddSemesterModal = ({ isOpen, onClose, onSubmit }) => {
   const [semesterData, setSemesterData] = useState({
      name: "",
      start_date: "",
      end_date: "",
      registration_start_date: "",
      registration_end_date: "",
   });
   const [errors, setErrors] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Reset form when modal is opened/closed
   const resetForm = () => {
      setSemesterData({
         name: "",
         start_date: "",
         end_date: "",
         registration_start_date: "",
         registration_end_date: "",
      });
      setErrors({});
      setIsSubmitting(false);
   };

   // Handle input changes
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSemesterData((prev) => ({
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

   // Validate form
   const validateForm = () => {
      const newErrors = {};

      if (!semesterData.name.trim()) {
         newErrors.name = "Semester name is required";
      }

      if (!semesterData.start_date) {
         newErrors.start_date = "Start date is required";
      }

      if (!semesterData.end_date) {
         newErrors.end_date = "End date is required";
      } else if (semesterData.start_date && new Date(semesterData.start_date) > new Date(semesterData.end_date)) {
         newErrors.end_date = "End date must be after start date";
      }

      // Validate registration dates if provided
      if (semesterData.registration_start_date && semesterData.registration_end_date) {
         if (new Date(semesterData.registration_start_date) > new Date(semesterData.registration_end_date)) {
            newErrors.registration_end_date = "Registration end date must be after registration start date";
         }
      }

      // Registration dates should be within semester dates if provided
      if (semesterData.registration_start_date && semesterData.start_date) {
         if (new Date(semesterData.registration_start_date) > new Date(semesterData.start_date)) {
            newErrors.registration_start_date = "Registration start date should be before or on semester start date";
         }
      }

      if (semesterData.registration_end_date && semesterData.start_date) {
         if (new Date(semesterData.registration_end_date) > new Date(semesterData.start_date)) {
            newErrors.registration_end_date = "Registration end date should be before or on semester start date";
         }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
         // Format dates to RFC3339 format
         const formattedData = {
            ...semesterData,
            start_date: new Date(semesterData.start_date).toISOString(),
            end_date: new Date(semesterData.end_date).toISOString(),
            registration_start_date: semesterData.registration_start_date
               ? new Date(semesterData.registration_start_date).toISOString()
               : null,
            registration_end_date: semesterData.registration_end_date
               ? new Date(semesterData.registration_end_date).toISOString()
               : null,
         };

         // Submit form data
         await onSubmit(formattedData);

         // Close modal and reset form on success
         resetForm();
         onClose();
      } catch (error) {
         console.error("Error adding semester:", error);
         setErrors((prev) => ({
            ...prev,
            form: error.message || "Failed to add semester. Please try again.",
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
               <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
               &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">Add New Semester</h3>
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
                     {/* Semester Name */}
                     <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                           Semester Name <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           id="name"
                           name="name"
                           value={semesterData.name}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.name ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           placeholder="e.g., Spring 2025"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                     </div>

                     {/* Start Date */}
                     <div className="mb-4">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                           Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="date"
                           id="start_date"
                           name="start_date"
                           value={semesterData.start_date}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.start_date ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        />
                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                     </div>

                     {/* End Date */}
                     <div className="mb-4">
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                           End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="date"
                           id="end_date"
                           name="end_date"
                           value={semesterData.end_date}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.end_date ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                     </div>

                     {/* Registration Time Frame Section */}
                     <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Registration Time Frame (Optional)</h4>
                        <p className="text-xs text-gray-600 mb-4">
                           Set specific dates when students can register for courses in this semester. Leave empty to allow
                           registration at any time.
                        </p>

                        {/* Registration Start Date */}
                        <div className="mb-4">
                           <label htmlFor="registration_start_date" className="block text-sm font-medium text-gray-700 mb-1">
                              Registration Start Date
                           </label>
                           <input
                              type="datetime-local"
                              id="registration_start_date"
                              name="registration_start_date"
                              value={semesterData.registration_start_date}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 border ${
                                 errors.registration_start_date ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           />
                           {errors.registration_start_date && (
                              <p className="mt-1 text-sm text-red-600">{errors.registration_start_date}</p>
                           )}
                        </div>

                        {/* Registration End Date */}
                        <div className="mb-0">
                           <label htmlFor="registration_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                              Registration End Date
                           </label>
                           <input
                              type="datetime-local"
                              id="registration_end_date"
                              name="registration_end_date"
                              value={semesterData.registration_end_date}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 border ${
                                 errors.registration_end_date ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           />
                           {errors.registration_end_date && (
                              <p className="mt-1 text-sm text-red-600">{errors.registration_end_date}</p>
                           )}
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? "Adding..." : "Add Semester"}
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

export default AddSemesterModal;
