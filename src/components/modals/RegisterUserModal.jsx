import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiX, FiUser, FiMail, FiLock, FiTag, FiAlertCircle, FiCheck } from "react-icons/fi";
import { registerUser } from "../../store/slices/userSlice";

const RegisterUserModal = ({ isOpen, onClose }) => {
   const dispatch = useDispatch();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);
   const [errors, setErrors] = useState({});

   // Default user data with moderator role
   const [userData, setUserData] = useState({
      username: "olzzhas@edunite.com",
      email: "olzzhas@edunite.com",
      password: "Olzhas123451",
      name: "Olzhas",
      surname: "Mukhanbetzhan",
      role: "moderator",
   });

   // Reset form when modal is opened/closed
   const resetForm = () => {
      setUserData({
         username: "olzzhas@edunite.com",
         email: "olzzhas@edunite.com",
         password: "Olzhas123451",
         name: "Olzhas",
         surname: "Mukhanbetzhan",
         role: "moderator",
      });
      setErrors({});
      setIsSubmitting(false);
      setSuccess(false);
   };

   // Handle input changes
   const handleInputChange = (e) => {
      const { name, value } = e.target;

      // If email is changed, also update username to match
      if (name === "email") {
         setUserData((prev) => ({
            ...prev,
            [name]: value,
            username: value, // Set username to same value as email
         }));
      } else {
         setUserData((prev) => ({
            ...prev,
            [name]: value,
         }));
      }

      // Clear error when field is edited
      if (errors[name]) {
         setErrors((prev) => ({
            ...prev,
            [name]: null,
         }));
      }

      // Clear success message when user starts editing again
      if (success) {
         setSuccess(false);
      }
   };

   // Validate form
   const validateForm = () => {
      const newErrors = {};

      if (!userData.name.trim()) {
         newErrors.name = "First name is required";
      }

      if (!userData.surname.trim()) {
         newErrors.surname = "Last name is required";
      }

      if (!userData.email.trim()) {
         newErrors.email = "Email is required";
      } else {
         // Check if email is valid
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(userData.email)) {
            newErrors.email = "Please enter a valid email address";
         }
      }

      if (!userData.password.trim()) {
         newErrors.password = "Password is required";
      } else if (userData.password.length < 8) {
         newErrors.password = "Password must be at least 8 characters long";
      }

      if (!userData.role) {
         newErrors.role = "Role is required";
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
         await dispatch(registerUser(userData)).unwrap();
         setSuccess(true);

         // Reset form after 3 seconds
         setTimeout(() => {
            resetForm();
            onClose();
         }, 3000);
      } catch (error) {
         console.error("Registration error:", error);

         // Handle specific errors
         if (error.includes("email") || error.includes("username")) {
            setErrors((prev) => ({
               ...prev,
               email: "This email is already in use",
            }));
         } else if (error.includes("password")) {
            setErrors((prev) => ({
               ...prev,
               password: "Password doesn't meet requirements",
            }));
         } else {
            // Generic error
            setErrors((prev) => ({
               ...prev,
               form: error || "Registration failed. Please try again.",
            }));
         }
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
                     <h3 className="text-lg font-medium text-gray-900">Register New User</h3>
                     <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={handleClose}>
                        <FiX size={24} />
                     </button>
                  </div>

                  {/* Success message */}
                  {success && (
                     <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                           <FiCheck className="text-green-500 mr-2" />
                           <span className="text-green-700">User registered successfully!</span>
                        </div>
                     </div>
                  )}

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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* First Name */}
                        <div>
                           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              First Name <span className="text-red-500">*</span>
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FiUser className={`${errors.name ? "text-red-400" : "text-gray-400"}`} />
                              </div>
                              <input
                                 type="text"
                                 id="name"
                                 name="name"
                                 value={userData.name}
                                 onChange={handleInputChange}
                                 className={`block w-full pl-10 pr-3 py-2 border ${
                                    errors.name ? "border-red-300" : "border-gray-300"
                                 } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                              />
                              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                           </div>
                        </div>

                        {/* Last Name */}
                        <div>
                           <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name <span className="text-red-500">*</span>
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FiUser className={`${errors.surname ? "text-red-400" : "text-gray-400"}`} />
                              </div>
                              <input
                                 type="text"
                                 id="surname"
                                 name="surname"
                                 value={userData.surname}
                                 onChange={handleInputChange}
                                 className={`block w-full pl-10 pr-3 py-2 border ${
                                    errors.surname ? "border-red-300" : "border-gray-300"
                                 } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                              />
                              {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
                           </div>
                        </div>
                     </div>

                     {/* Email */}
                     <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                           Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className={`${errors.email ? "text-red-400" : "text-gray-400"}`} />
                           </div>
                           <input
                              type="email"
                              id="email"
                              name="email"
                              value={userData.email}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                 errors.email ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           />
                           {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                           <p className="mt-1 text-xs text-gray-500">Username will be the same as email</p>
                        </div>
                     </div>

                     {/* Password */}
                     <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                           Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className={`${errors.password ? "text-red-400" : "text-gray-400"}`} />
                           </div>
                           <input
                              type="password"
                              id="password"
                              name="password"
                              value={userData.password}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                 errors.password ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           />
                           {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                     </div>

                     {/* Role */}
                     <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                           Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiTag className={`${errors.role ? "text-red-400" : "text-gray-400"}`} />
                           </div>
                           <select
                              id="role"
                              name="role"
                              value={userData.role}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                 errors.role ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           >
                              <option value="">Select Role</option>
                              <option value="admin">Admin</option>
                              <option value="moderator">Moderator</option>
                              <option value="teacher">Teacher</option>
                              <option value="student">Student</option>
                           </select>
                           {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isSubmitting ? "Registering..." : "Register User"}
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

export default RegisterUserModal;
