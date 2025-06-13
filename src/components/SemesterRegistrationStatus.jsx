import React, { useState, useEffect } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import { semesterService } from "../services/api";

const SemesterRegistrationStatus = ({ semester, compact = false }) => {
   const [registrationStatus, setRegistrationStatus] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (semester && semester.id) {
         fetchRegistrationStatus();
      }
   }, [semester]);

   const fetchRegistrationStatus = async () => {
      try {
         setLoading(true);
         const status = await semesterService.getRegistrationStatus(semester.id);
         setRegistrationStatus(status);
      } catch (error) {
         console.error("Error fetching registration status:", error);
         setRegistrationStatus(null);
      } finally {
         setLoading(false);
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

      return {
         date: date.toLocaleDateString(),
         time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
   };

   const getStatusIcon = () => {
      if (loading) return <FiClock className="animate-spin text-gray-400" size={16} />;
      if (!registrationStatus) return <FiXCircle className="text-gray-400" size={16} />;
      return registrationStatus.is_open ? (
         <FiCheckCircle className="text-green-500" size={16} />
      ) : (
         <FiXCircle className="text-red-500" size={16} />
      );
   };

   const getStatusText = () => {
      if (loading) return "Checking...";
      if (!registrationStatus) return "Unknown";
      return registrationStatus.is_open ? "Open" : "Closed";
   };

   const getStatusColor = () => {
      if (loading || !registrationStatus) return "text-gray-500";
      return registrationStatus.is_open ? "text-green-600" : "text-red-600";
   };

   const isRegistrationPeriodSet = () => {
      return registrationStatus && (registrationStatus.registration_start_date || registrationStatus.registration_end_date);
   };

   if (compact) {
      return (
         <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Registration Status</h4>
            <button
               onClick={fetchRegistrationStatus}
               disabled={loading}
               className="text-xs text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
               Refresh
            </button>
         </div>

         <div className="space-y-3">
            {/* Current Status */}
            <div className="flex items-center space-x-2">
               {getStatusIcon()}
               <span className={`text-sm font-medium ${getStatusColor()}`}>Registration {getStatusText()}</span>
            </div>

            {/* Registration Period Details */}
            {registrationStatus && isRegistrationPeriodSet() && (
               <div className="space-y-2 text-xs text-gray-600">
                  {registrationStatus.registration_start_date && (
                     <div className="flex items-center space-x-2">
                        <FiCalendar size={12} className="text-gray-400" />
                        <span>
                           <span className="font-medium">Opens:</span>{" "}
                           {(() => {
                              const formatted = formatDateTime(registrationStatus.registration_start_date);
                              return `${formatted.date} at ${formatted.time}`;
                           })()}
                        </span>
                     </div>
                  )}

                  {registrationStatus.registration_end_date && (
                     <div className="flex items-center space-x-2">
                        <FiCalendar size={12} className="text-gray-400" />
                        <span>
                           <span className="font-medium">Closes:</span>{" "}
                           {(() => {
                              const formatted = formatDateTime(registrationStatus.registration_end_date);
                              return `${formatted.date} at ${formatted.time}`;
                           })()}
                        </span>
                     </div>
                  )}
               </div>
            )}

            {/* No restrictions message */}
            {registrationStatus && !isRegistrationPeriodSet() && (
               <div className="text-xs text-gray-500">No time restrictions set</div>
            )}

            {/* Error state */}
            {!loading && !registrationStatus && <div className="text-xs text-red-500">Failed to load registration status</div>}
         </div>
      </div>
   );
};

export default SemesterRegistrationStatus;
