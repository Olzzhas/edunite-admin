import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBell, FiSend, FiUsers, FiUser, FiBook, FiLayers, FiCalendar, FiAlertCircle, FiList, FiPlus } from "react-icons/fi";
import Select from "react-select";
import { useToast } from "../contexts/ToastContext";
import { createNotification, resetNotificationState, fetchAllNotifications } from "../store/slices/notificationSlice";
import { notificationService } from "../services/api";
import { formatTimestamp } from "../utils/dateUtils";
import { processEmailTemplates } from "../utils/templateUtils";
import "../styles/react-select.css";

const Notifications = () => {
   const dispatch = useDispatch();
   const { creating, error, success, message, notifications, loading, totalCount } = useSelector((state) => state.notifications);
   const { addToast } = useToast();

   const [activeTab, setActiveTab] = useState("create"); // "create" or "list"

   const [formData, setFormData] = useState({
      title: "",
      message: "",
      type: "info",
      priority: "normal",
      target_type: "all",
      target_value: "",
      send_email: false,
      email_subject: "",
      email_template: "default_notification",
      scheduled_at: "",
   });

   const [targetOptions, setTargetOptions] = useState([]);
   const [emailTemplates, setEmailTemplates] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState({});

   // Notification types
   const notificationTypes = [
      { value: "info", label: "Info", icon: "ℹ️" },
      { value: "warning", label: "Warning", icon: "⚠️" },
      { value: "success", label: "Success", icon: "✅" },
      { value: "error", label: "Error", icon: "❌" },
      { value: "announcement", label: "Announcement", icon: "📢" },
   ];

   // Priority levels
   const priorityLevels = [
      { value: "low", label: "Low", color: "text-gray-600" },
      { value: "normal", label: "Normal", color: "text-blue-600" },
      { value: "high", label: "High", color: "text-orange-600" },
      { value: "urgent", label: "Urgent", color: "text-red-600" },
   ];

   // Target types
   const targetTypes = [
      { value: "all", label: "All Users", icon: <FiUsers />, description: "Send to all users in the system" },
      { value: "role", label: "By Role", icon: <FiUser />, description: "Send to users with specific role" },
      { value: "user", label: "Specific User", icon: <FiUser />, description: "Send to a specific user" },
      { value: "degree", label: "By Degree", icon: <FiBook />, description: "Send to students in specific degree" },
      { value: "course", label: "By Course", icon: <FiLayers />, description: "Send to students in specific course" },
      { value: "thread", label: "By Thread", icon: <FiCalendar />, description: "Send to students in specific thread" },
   ];

   // Load email templates and notifications on component mount
   useEffect(() => {
      const loadEmailTemplates = async () => {
         try {
            console.log("Loading email templates...");
            const response = await notificationService.getEmailTemplates();
            console.log("Email templates API response:", response);

            // Handle the API response structure: { templates: [...], total_count: number }
            const templates = response?.templates || [];

            // Process templates using utility function
            const processedTemplates = processEmailTemplates(templates);

            console.log("Processed templates:", processedTemplates);

            if (processedTemplates.length > 0) {
               setEmailTemplates(processedTemplates);
               console.log("Using API templates:", processedTemplates.length, "templates loaded");
            } else {
               // Use default templates if API returns empty
               const defaultTemplates = [
                  { name: "default_notification", subject: "Notification" },
                  { name: "announcement", subject: "Important Announcement" },
                  { name: "urgent_notification", subject: "Urgent Notification" },
                  { name: "class_reminder", subject: "Class Reminder" },
                  { name: "assignment_notification", subject: "Assignment Notification" },
                  { name: "grade_notification", subject: "Grade Notification" },
                  { name: "welcome_student", subject: "Welcome Student" },
               ];
               setEmailTemplates(defaultTemplates);
               console.log("Using default templates:", defaultTemplates.length, "templates");
            }
         } catch (error) {
            console.error("Error loading email templates:", error);

            // Use default templates if API fails
            const defaultTemplates = [
               { name: "default_notification", subject: "Notification" },
               { name: "announcement", subject: "Important Announcement" },
               { name: "urgent_notification", subject: "Urgent Notification" },
               { name: "class_reminder", subject: "Class Reminder" },
               { name: "assignment_notification", subject: "Assignment Notification" },
               { name: "grade_notification", subject: "Grade Notification" },
               { name: "welcome_student", subject: "Welcome Student" },
            ];
            setEmailTemplates(defaultTemplates);
            console.log("Using fallback templates due to error:", defaultTemplates.length, "templates");
         }
      };

      loadEmailTemplates();

      // Load notifications if on list tab
      if (activeTab === "list") {
         dispatch(fetchAllNotifications({ page: 1, limit: 20 }));
      }
   }, [activeTab, dispatch]);

   // Load target options based on target type
   useEffect(() => {
      const loadTargetOptions = async () => {
         try {
            let options = [];

            switch (formData.target_type) {
               case "role":
                  // For now, use predefined roles
                  options = [
                     { value: "admin", label: "Admin" },
                     { value: "teacher", label: "Teacher" },
                     { value: "student", label: "Student" },
                  ];
                  break;
               case "user":
                  const users = await notificationService.getUsers({ limit: 100 });
                  options = (users.users || []).map((user) => ({
                     value: user.id.toString(),
                     label: `${user.name} ${user.surname} (${user.email})`,
                  }));
                  break;
               case "degree":
                  const degrees = await notificationService.getDegrees();
                  options = (degrees.degrees || []).map((degree) => ({
                     value: degree.id.toString(),
                     label: degree.name,
                  }));
                  break;
               case "course":
                  const courses = await notificationService.getCourses();
                  options = (courses.courses || []).map((course) => ({
                     value: course.id.toString(),
                     label: course.title,
                  }));
                  break;
               case "thread":
                  const threads = await notificationService.getThreads();
                  options = (threads.threads || []).map((thread) => ({
                     value: thread.id.toString(),
                     label: thread.name,
                  }));
                  break;
               default:
                  options = [];
            }

            setTargetOptions(options);
         } catch (error) {
            console.error("Error loading target options:", error);
            setTargetOptions([]);
         }
      };

      if (formData.target_type !== "all") {
         loadTargetOptions();
      } else {
         setTargetOptions([]);
      }
   }, [formData.target_type]);

   // Handle form input changes
   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));

      // Clear error when field is edited
      if (errors[name]) {
         setErrors((prev) => ({
            ...prev,
            [name]: null,
         }));
      }
   };

   // Handle target type change
   const handleTargetTypeChange = (targetType) => {
      setFormData((prev) => ({
         ...prev,
         target_type: targetType,
         target_value: "", // Reset target value when type changes
      }));
   };

   // Handle target value change
   const handleTargetValueChange = (selectedOption) => {
      setFormData((prev) => ({
         ...prev,
         target_value: selectedOption ? selectedOption.value : "",
      }));
   };

   // Validate form
   const validateForm = () => {
      const newErrors = {};

      if (!formData.title.trim()) {
         newErrors.title = "Title is required";
      }

      if (!formData.message.trim()) {
         newErrors.message = "Message is required";
      }

      if (formData.target_type !== "all" && !formData.target_value) {
         newErrors.target_value = "Please select a target";
      }

      if (formData.send_email && !formData.email_subject.trim()) {
         newErrors.email_subject = "Email subject is required when sending email";
      }

      if (formData.scheduled_at) {
         const scheduledDate = new Date(formData.scheduled_at);
         const now = new Date();
         if (scheduledDate <= now) {
            newErrors.scheduled_at = "Scheduled time must be in the future";
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
         // Prepare notification data
         const notificationData = {
            title: formData.title,
            message: formData.message,
            type: formData.type,
            priority: formData.priority,
            target_type: formData.target_type,
            target_value: formData.target_value || "",
            send_email: formData.send_email,
            email_subject: formData.send_email ? formData.email_subject : "",
            email_template: formData.send_email ? formData.email_template : "",
         };

         // Add scheduled_at if provided
         if (formData.scheduled_at) {
            notificationData.scheduled_at = new Date(formData.scheduled_at).toISOString();
         }

         // Debug: Log the notification data being sent
         console.log("Sending notification data:", notificationData);

         // Validate email template if sending email
         if (formData.send_email && formData.email_template) {
            const selectedTemplate = emailTemplates.find((t) => t.name === formData.email_template);
            if (!selectedTemplate) {
               throw new Error(`Email template "${formData.email_template}" not found`);
            }
            console.log("Using email template:", selectedTemplate);
         }

         // Dispatch create notification action
         const result = await dispatch(createNotification(notificationData)).unwrap();
         console.log("Notification creation result:", result);

         // Show success message
         addToast("Notification sent successfully!", "success", 3000);

         // Reset form
         setFormData({
            title: "",
            message: "",
            type: "info",
            priority: "normal",
            target_type: "all",
            target_value: "",
            send_email: false,
            email_subject: "",
            email_template: "default_notification",
            scheduled_at: "",
         });
      } catch (error) {
         console.error("Error sending notification:", error);

         // More detailed error handling
         let errorMessage = "Failed to send notification";
         if (error?.response?.data?.message) {
            errorMessage += ": " + error.response.data.message;
         } else if (error?.message) {
            errorMessage += ": " + error.message;
         } else if (typeof error === "string") {
            errorMessage += ": " + error;
         }

         addToast(errorMessage, "error", 5000);
      } finally {
         setIsSubmitting(false);
      }
   };

   // Reset notification state on component unmount
   useEffect(() => {
      return () => {
         dispatch(resetNotificationState());
      };
   }, [dispatch]);

   return (
      <div className="p-4">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
               <FiBell className="text-primary-600 mr-3" size={24} />
               <h1 className="text-xl font-medium">Notifications</h1>
            </div>
         </div>

         {/* Tabs */}
         <div className="mb-6">
            <div className="border-b border-gray-200">
               <nav className="-mb-px flex space-x-8">
                  <button
                     onClick={() => setActiveTab("create")}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "create"
                           ? "border-primary-500 text-primary-600"
                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                     }`}
                  >
                     <FiPlus className="inline mr-2" size={16} />
                     Send Notification
                  </button>
                  <button
                     onClick={() => setActiveTab("list")}
                     className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "list"
                           ? "border-primary-500 text-primary-600"
                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                     }`}
                  >
                     <FiList className="inline mr-2" size={16} />
                     Sent Notifications
                  </button>
               </nav>
            </div>
         </div>

         <div className="max-w-4xl mx-auto">
            {activeTab === "create" ? (
               <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {/* Form-level error message */}
                  {error && (
                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                           <FiAlertCircle className="text-red-500 mr-2" />
                           <span className="text-red-700">{error}</span>
                        </div>
                     </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Basic Information */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
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
                              placeholder="Enter notification title"
                           />
                           {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Type */}
                        <div>
                           <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                           </label>
                           <select
                              id="type"
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                           >
                              {notificationTypes.map((type) => (
                                 <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {/* Priority */}
                        <div>
                           <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                              Priority
                           </label>
                           <select
                              id="priority"
                              name="priority"
                              value={formData.priority}
                              onChange={handleInputChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                           >
                              {priorityLevels.map((priority) => (
                                 <option key={priority.value} value={priority.value}>
                                    {priority.label}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Message */}
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                           Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                           id="message"
                           name="message"
                           value={formData.message}
                           onChange={handleInputChange}
                           rows="4"
                           className={`block w-full px-3 py-2 border ${
                              errors.message ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                           placeholder="Enter your notification message"
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                     </div>

                     {/* Target Selection */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                           Send To <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                           {targetTypes.map((target) => (
                              <div
                                 key={target.value}
                                 className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                                    formData.target_type === target.value
                                       ? "border-primary-500 bg-primary-50"
                                       : "border-gray-300 hover:border-gray-400"
                                 }`}
                                 onClick={() => handleTargetTypeChange(target.value)}
                              >
                                 <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                       <div
                                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                             formData.target_type === target.value
                                                ? "border-primary-500 bg-primary-500"
                                                : "border-gray-300"
                                          }`}
                                       >
                                          {formData.target_type === target.value && (
                                             <div className="w-2 h-2 bg-white rounded-full" />
                                          )}
                                       </div>
                                    </div>
                                    <div className="ml-3">
                                       <div className="flex items-center">
                                          <span className="text-primary-600 mr-2">{target.icon}</span>
                                          <span className="text-sm font-medium text-gray-900">{target.label}</span>
                                       </div>
                                       <p className="text-xs text-gray-500 mt-1">{target.description}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Target Value Selection */}
                     {formData.target_type !== "all" && (
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Select Target <span className="text-red-500">*</span>
                           </label>
                           <Select
                              options={targetOptions}
                              value={targetOptions.find((option) => option.value === formData.target_value) || null}
                              onChange={handleTargetValueChange}
                              placeholder={`Select ${targetTypes
                                 .find((t) => t.value === formData.target_type)
                                 ?.label.toLowerCase()}...`}
                              isSearchable
                              className="react-select-container"
                              classNamePrefix="react-select"
                           />
                           {errors.target_value && <p className="mt-1 text-sm text-red-600">{errors.target_value}</p>}
                        </div>
                     )}

                     {/* Email Settings */}
                     <div className="border-t pt-6">
                        <div className="flex items-center mb-4">
                           <input
                              type="checkbox"
                              id="send_email"
                              name="send_email"
                              checked={formData.send_email}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                           />
                           <label htmlFor="send_email" className="ml-2 block text-sm text-gray-900">
                              Send email notification
                           </label>
                        </div>

                        {formData.send_email && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                              {/* Email Subject */}
                              <div>
                                 <label htmlFor="email_subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Subject <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                    type="text"
                                    id="email_subject"
                                    name="email_subject"
                                    value={formData.email_subject}
                                    onChange={handleInputChange}
                                    className={`block w-full px-3 py-2 border ${
                                       errors.email_subject ? "border-red-300" : "border-gray-300"
                                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                    placeholder="Enter email subject"
                                 />
                                 {errors.email_subject && <p className="mt-1 text-sm text-red-600">{errors.email_subject}</p>}
                              </div>

                              {/* Email Template */}
                              <div>
                                 <label htmlFor="email_template" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Template
                                 </label>
                                 <select
                                    id="email_template"
                                    name="email_template"
                                    value={formData.email_template}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                 >
                                    {Array.isArray(emailTemplates) &&
                                       emailTemplates.map((template) => (
                                          <option key={template.name} value={template.name}>
                                             {template.subject || template.name}
                                          </option>
                                       ))}
                                 </select>
                                 <p className="mt-1 text-xs text-gray-500">
                                    {emailTemplates.length > 0
                                       ? `${emailTemplates.length} templates available`
                                       : "Loading templates..."}
                                 </p>
                                 {/* Show selected template info */}
                                 {formData.email_template && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                       <strong>Selected:</strong> {formData.email_template}
                                       {(() => {
                                          const selectedTemplate = emailTemplates.find((t) => t.name === formData.email_template);
                                          return selectedTemplate ? (
                                             <div className="mt-1">
                                                <div>
                                                   <strong>Subject:</strong> {selectedTemplate.subject}
                                                </div>
                                                {selectedTemplate.variables && (
                                                   <div>
                                                      <strong>Variables:</strong>{" "}
                                                      {Object.keys(selectedTemplate.variables).join(", ")}
                                                   </div>
                                                )}
                                             </div>
                                          ) : null;
                                       })()}
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Scheduling */}
                     <div className="border-t pt-6">
                        <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                           Schedule for later (optional)
                        </label>
                        <input
                           type="datetime-local"
                           id="scheduled_at"
                           name="scheduled_at"
                           value={formData.scheduled_at}
                           onChange={handleInputChange}
                           className={`block w-full md:w-1/2 px-3 py-2 border ${
                              errors.scheduled_at ? "border-red-300" : "border-gray-300"
                           } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        />
                        {errors.scheduled_at && <p className="mt-1 text-sm text-red-600">{errors.scheduled_at}</p>}
                        <p className="mt-1 text-xs text-gray-500">Leave empty to send immediately</p>
                     </div>

                     {/* Submit Button */}
                     <div className="flex justify-end pt-6 border-t">
                        <button
                           type="submit"
                           disabled={isSubmitting || creating}
                           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <FiSend className="mr-2" size={16} />
                           {isSubmitting || creating ? "Sending..." : "Send Notification"}
                        </button>
                     </div>
                  </form>
               </div>
            ) : (
               <div className="bg-white rounded-lg border border-gray-200">
                  {/* Notifications List Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                     <h2 className="text-lg font-medium text-gray-900">Sent Notifications</h2>
                     <p className="text-sm text-gray-500 mt-1">
                        {totalCount > 0 ? `${totalCount} notifications sent` : "No notifications sent yet"}
                     </p>
                  </div>

                  {/* Notifications List */}
                  <div className="divide-y divide-gray-200">
                     {loading ? (
                        <div className="flex justify-center py-12">
                           <svg
                              className="animate-spin h-8 w-8 text-primary-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              ></circle>
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                           </svg>
                        </div>
                     ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                     ) : notifications.length === 0 ? (
                        <div className="text-center py-12">
                           <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                           <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                           <p className="mt-1 text-sm text-gray-500">Get started by sending your first notification.</p>
                           <div className="mt-6">
                              <button
                                 onClick={() => setActiveTab("create")}
                                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                              >
                                 <FiPlus className="mr-2" size={16} />
                                 Send Notification
                              </button>
                           </div>
                        </div>
                     ) : (
                        notifications.map((notification) => (
                           <div key={notification.id} className="px-6 py-4">
                              <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                    <div className="flex items-center">
                                       <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                       <span
                                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                             notification.type === "info"
                                                ? "bg-blue-100 text-blue-800"
                                                : notification.type === "warning"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : notification.type === "success"
                                                ? "bg-green-100 text-green-800"
                                                : notification.type === "error"
                                                ? "bg-red-100 text-red-800"
                                                : notification.type === "announcement"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-gray-100 text-gray-800"
                                          }`}
                                       >
                                          {notification.type}
                                       </span>
                                       <span
                                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                             notification.priority === "low"
                                                ? "bg-gray-100 text-gray-800"
                                                : notification.priority === "normal"
                                                ? "bg-blue-100 text-blue-800"
                                                : notification.priority === "high"
                                                ? "bg-orange-100 text-orange-800"
                                                : notification.priority === "urgent"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                          }`}
                                       >
                                          {notification.priority}
                                       </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                    <div className="mt-2 flex items-center text-xs text-gray-500">
                                       <span>
                                          Target:{" "}
                                          {notification.target_type === "all"
                                             ? "All Users"
                                             : `${notification.target_type}: ${notification.target_value}`}
                                       </span>
                                       <span className="mx-2">•</span>
                                       <span>Created: {formatTimestamp(notification.created_at)}</span>
                                       {notification.sent_at && (
                                          <>
                                             <span className="mx-2">•</span>
                                             <span>Sent: {formatTimestamp(notification.sent_at)}</span>
                                          </>
                                       )}
                                       {notification.scheduled_at && !notification.sent_at && (
                                          <>
                                             <span className="mx-2">•</span>
                                             <span>Scheduled: {formatTimestamp(notification.scheduled_at)}</span>
                                          </>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Notifications;
