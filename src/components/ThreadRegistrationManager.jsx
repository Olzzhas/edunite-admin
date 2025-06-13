import React, { useState, useEffect } from "react";
import { FiClock, FiUsers, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { semesterService } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const ThreadRegistrationManager = ({ thread, onRegistrationUpdate }) => {
   const [registrationStatus, setRegistrationStatus] = useState(null);
   const [loading, setLoading] = useState(true);
   const [registering, setRegistering] = useState(false);
   const { addToast } = useToast();

   useEffect(() => {
      if (thread && thread.semester_id) {
         fetchRegistrationStatus();
      }
   }, [thread]);

   const fetchRegistrationStatus = async () => {
      try {
         setLoading(true);
         const status = await semesterService.getRegistrationStatus(thread.semester_id);
         setRegistrationStatus(status);
      } catch (error) {
         console.error("Error fetching registration status:", error);
         addToast("Failed to fetch registration status", "error");
      } finally {
         setLoading(false);
      }
   };

   const handleStudentRegistration = async (userId) => {
      try {
         setRegistering(true);
         await semesterService.registerStudentToThread(userId, thread.id);
         addToast("Student registered successfully", "success");
         if (onRegistrationUpdate) {
            onRegistrationUpdate();
         }
      } catch (error) {
         console.error("Error registering student:", error);
         addToast(error.message || "Failed to register student", "error");
      } finally {
         setRegistering(false);
      }
   };

   const handleBulkRegistration = async (userIds) => {
      try {
         setRegistering(true);
         const result = await semesterService.registerManyStudentsToThread(userIds, thread.id);
         addToast(`Successfully registered ${result.successful_registrations} students`, "success");
         if (result.failed_registrations > 0) {
            addToast(`Failed to register ${result.failed_registrations} students`, "warning");
         }
         if (onRegistrationUpdate) {
            onRegistrationUpdate();
         }
      } catch (error) {
         console.error("Error registering students:", error);
         addToast(error.message || "Failed to register students", "error");
      } finally {
         setRegistering(false);
      }
   };

   const formatDateTime = (dateValue) => {
      if (!dateValue) return null;

      // Handle both RFC3339 strings and Firebase timestamp format for backward compatibility
      let date;
      if (typeof dateValue === "string") {
         // RFC3339 format from new API
         date = new Date(dateValue);
      } else if (dateValue.seconds) {
         // Firebase timestamp format (fallback)
         date = new Date(dateValue.seconds * 1000);
      } else {
         date = new Date(dateValue);
      }

      return date.toLocaleString();
   };

   const getStatusIcon = () => {
      if (loading) return <FiClock className="animate-spin" />;
      if (!registrationStatus) return <FiAlertCircle className="text-gray-500" />;
      return registrationStatus.is_open ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />;
   };

   const getStatusText = () => {
      if (loading) return "Checking registration status...";
      if (!registrationStatus) return "Registration status unknown";
      return registrationStatus.is_open ? "Registration Open" : "Registration Closed";
   };

   const getStatusColor = () => {
      if (loading || !registrationStatus) return "text-gray-500";
      return registrationStatus.is_open ? "text-green-600" : "text-red-600";
   };

   if (!thread) {
      return (
         <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No thread selected</p>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Registration Management</h3>
            <button
               onClick={fetchRegistrationStatus}
               disabled={loading}
               className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
               Refresh Status
            </button>
         </div>

         {/* Registration Status */}
         <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
               {getStatusIcon()}
               <span className={`ml-2 font-medium ${getStatusColor()}`}>{getStatusText()}</span>
            </div>

            {registrationStatus && (
               <div className="text-sm text-gray-600 space-y-1">
                  {registrationStatus.registration_start_date && (
                     <p>
                        <span className="font-medium">Opens:</span> {formatDateTime(registrationStatus.registration_start_date)}
                     </p>
                  )}
                  {registrationStatus.registration_end_date && (
                     <p>
                        <span className="font-medium">Closes:</span> {formatDateTime(registrationStatus.registration_end_date)}
                     </p>
                  )}
                  {!registrationStatus.registration_start_date && !registrationStatus.registration_end_date && (
                     <p>No time restrictions set for this semester</p>
                  )}
               </div>
            )}
         </div>

         {/* Thread Information */}
         <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Thread Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                  <span className="font-medium text-gray-700">Course:</span>
                  <p className="text-gray-600">{thread.course?.title || "N/A"}</p>
               </div>
               <div>
                  <span className="font-medium text-gray-700">Teacher:</span>
                  <p className="text-gray-600">{thread.teacher?.name || "N/A"}</p>
               </div>
               <div>
                  <span className="font-medium text-gray-700">Current Students:</span>
                  <p className="text-gray-600">
                     {thread.students?.length || 0} / {thread.max_students || "Unlimited"}
                  </p>
               </div>
               <div>
                  <span className="font-medium text-gray-700">Semester:</span>
                  <p className="text-gray-600">{thread.semester?.name || "N/A"}</p>
               </div>
            </div>
         </div>

         {/* Registration Actions */}
         <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Registration Actions</h4>

            {registrationStatus && !registrationStatus.is_open ? (
               <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                     <FiXCircle className="text-red-500 mr-2" />
                     <span className="text-red-700 text-sm">Registration is currently closed for this semester</span>
                  </div>
               </div>
            ) : (
               <div className="space-y-3">
                  <p className="text-sm text-gray-600">Registration is open. You can register students to this thread.</p>

                  {/* Note: Actual registration UI would be implemented based on specific requirements */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                     <div className="flex items-center">
                        <FiUsers className="text-blue-500 mr-2" />
                        <div className="text-blue-700 text-sm">
                           <p>Use the thread management interface to register students</p>
                           <p className="text-xs text-blue-600 mt-1">
                              Note: Full registration validation requires backend API implementation
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default ThreadRegistrationManager;
