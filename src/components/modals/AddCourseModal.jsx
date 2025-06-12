import { useState, useEffect } from "react";
import { FiX, FiUpload, FiAlertCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../store/slices/courseSlice";
import Select from "react-select";

const AddCourseModal = ({ isOpen, onClose, onSubmit }) => {
   const dispatch = useDispatch();
   const { courses } = useSelector((state) => state.courses);

   // Ensure courses is always an array to prevent map errors
   const coursesList = Array.isArray(courses) ? courses : [];

   const [formData, setFormData] = useState({
      title: "",
      description: "",
      prerequisite_course_ids: [],
   });
   const [image, setImage] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [errors, setErrors] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Fetch courses on component mount
   useEffect(() => {
      dispatch(fetchCourses({ page: 0, size: 100 })); // Fetch all courses for selection
   }, [dispatch]);

   // Reset form when modal is opened/closed
   const resetForm = () => {
      setFormData({
         title: "",
         description: "",
         prerequisite_course_ids: [],
      });
      setImage(null);
      setImagePreview(null);
      setErrors({});
      setIsSubmitting(false);
   };

   // Handle input changes
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
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

   // Handle image upload
   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
         setErrors((prev) => ({
            ...prev,
            image: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
         }));
         return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
         setErrors((prev) => ({
            ...prev,
            image: "Image size must be less than 5MB",
         }));
         return;
      }

      // Clear error
      setErrors((prev) => ({
         ...prev,
         image: null,
      }));

      // Set image and create preview
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
         setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
   };

   // Validate form
   const validateForm = () => {
      const newErrors = {};

      if (!formData.title.trim()) {
         newErrors.title = "Title is required";
      }

      if (!formData.description.trim()) {
         newErrors.description = "Description is required";
      }

      if (!image) {
         newErrors.image = "Course image is required";
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
         // Create FormData object
         const formDataObj = new FormData();
         formDataObj.append("title", formData.title);
         formDataObj.append("description", formData.description);
         formDataObj.append("image", image);
         formDataObj.append("prerequisite_course_ids", JSON.stringify(formData.prerequisite_course_ids));

         // Submit form data
         await onSubmit(formDataObj);

         // Close modal and reset form on success
         resetForm();
         onClose();
      } catch (error) {
         console.error("Error adding course:", error);
         setErrors((prev) => ({
            ...prev,
            form: error.message || "Failed to add course. Please try again.",
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
                     <h3 className="text-lg font-medium text-gray-900">Add New Course</h3>
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
                           value={formData.title}
                           onChange={handleInputChange}
                           className={`block w-full px-3 py-2 border ${
                              errors.title ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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
                           value={formData.description}
                           onChange={handleInputChange}
                           rows="3"
                           className={`block w-full px-3 py-2 border ${
                              errors.description ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                     </div>

                     {/* Prerequisite Courses */}
                     <div className="mb-4">
                        <label htmlFor="prerequisite_course_ids" className="block text-sm font-medium text-gray-700 mb-1">
                           Prerequisite Courses
                        </label>
                        <Select
                           id="prerequisite_course_ids"
                           name="prerequisite_course_ids"
                           isMulti
                           options={coursesList.map((course) => ({ value: course.id, label: course.title }))}
                           value={coursesList
                              .filter((c) => formData.prerequisite_course_ids.includes(c.id))
                              .map((c) => ({ value: c.id, label: c.title }))}
                           onChange={(selected) => {
                              setFormData((prev) => ({
                                 ...prev,
                                 prerequisite_course_ids: selected ? selected.map((opt) => opt.value) : [],
                              }));
                           }}
                           classNamePrefix="react-select"
                           placeholder="Select prerequisite courses..."
                        />
                        <p className="mt-1 text-xs text-gray-500">You can search and select multiple courses</p>
                     </div>

                     {/* Image Upload */}
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Course Image <span className="text-red-500">*</span>
                        </label>
                        <div
                           className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                              errors.image ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                           }`}
                        >
                           <div className="space-y-1 text-center">
                              {imagePreview ? (
                                 <div className="mb-3">
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto object-cover rounded" />
                                 </div>
                              ) : (
                                 <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                              )}
                              <div className="flex text-sm text-gray-600">
                                 <label
                                    htmlFor="image-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                                 >
                                    <span>Upload an image</span>
                                    <input
                                       id="image-upload"
                                       name="image"
                                       type="file"
                                       accept="image/jpeg,image/png,image/gif,image/webp"
                                       className="sr-only"
                                       onChange={handleImageChange}
                                    />
                                 </label>
                                 <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">JPEG, PNG, GIF, or WEBP up to 5MB</p>
                           </div>
                        </div>
                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                     </div>

                     {/* Submit Button */}
                     <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? "Adding..." : "Add Course"}
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

export default AddCourseModal;
