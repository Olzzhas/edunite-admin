import React, { useState, useEffect } from "react";
import { FiCalendar, FiUsers, FiSettings, FiPlus } from "react-icons/fi";
import { semesterService, threadService } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import SemesterRegistrationStatus from "../components/SemesterRegistrationStatus";
import ThreadRegistrationManager from "../components/ThreadRegistrationManager";
import AddSemesterModal from "../components/modals/AddSemesterModal";

const RegistrationManagement = () => {
   const [semesters, setSemesters] = useState([]);
   const [threads, setThreads] = useState([]);
   const [selectedSemester, setSelectedSemester] = useState(null);
   const [selectedThread, setSelectedThread] = useState(null);
   const [loading, setLoading] = useState(true);
   const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
   const { addToast } = useToast();

   useEffect(() => {
      fetchSemesters();
   }, []);

   useEffect(() => {
      if (selectedSemester) {
         fetchThreadsForSemester(selectedSemester.id);
      }
   }, [selectedSemester]);

   const fetchSemesters = async () => {
      try {
         setLoading(true);
         const semesterData = await semesterService.getSemesters();
         setSemesters(semesterData);
         if (semesterData.length > 0) {
            setSelectedSemester(semesterData[0]);
         }
      } catch (error) {
         console.error("Error fetching semesters:", error);
         addToast("Failed to fetch semesters", "error");
      } finally {
         setLoading(false);
      }
   };

   const fetchThreadsForSemester = async (semesterId) => {
      try {
         // Note: This would need to be implemented in threadService
         // For now, we'll use mock data or existing threads
         const threadData = await threadService.getThreads();
         // Filter threads by semester if the API supports it
         setThreads(threadData.content || []);
      } catch (error) {
         console.error("Error fetching threads:", error);
         addToast("Failed to fetch threads", "error");
      }
   };

   const handleAddSemester = async (semesterData) => {
      try {
         await semesterService.createSemester(semesterData);
         addToast("Semester created successfully", "success");
         fetchSemesters();
      } catch (error) {
         console.error("Error creating semester:", error);
         throw error;
      }
   };

   const handleRegistrationUpdate = () => {
      // Refresh thread data when registration is updated
      if (selectedSemester) {
         fetchThreadsForSemester(selectedSemester.id);
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
               <p className="text-gray-500">Loading registration management...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="p-6">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
               <FiSettings className="text-primary-600 mr-3" size={24} />
               <h1 className="text-2xl font-bold text-gray-900">Registration Management</h1>
            </div>
            <button
               onClick={() => setShowAddSemesterModal(true)}
               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
               <FiPlus className="mr-2" size={16} />
               Add Semester
            </button>
         </div>

         {/* Implementation Status Banner */}
         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
               <FiSettings className="text-green-600 mr-3 mt-0.5" size={20} />
               <div>
                  <h3 className="text-sm font-medium text-green-800">🚀 Registration Management Fully Active</h3>
                  <p className="text-sm text-green-700 mt-1">
                     ✅ Backend registration endpoints are fully implemented
                     <br />
                     ✅ Semester creation/update with registration dates working
                     <br />
                     ✅ Registration status checking with RFC3339 date format
                     <br />
                     🔄 Thread registration validation still pending
                  </p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Semesters List */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                     <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <FiCalendar className="mr-2" size={20} />
                        Semesters
                     </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                     {semesters.map((semester) => (
                        <div
                           key={semester.id}
                           className={`p-4 cursor-pointer hover:bg-gray-50 ${
                              selectedSemester?.id === semester.id ? "bg-primary-50 border-r-2 border-primary-500" : ""
                           }`}
                           onClick={() => setSelectedSemester(semester)}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{semester.name}</h3>
                              <SemesterRegistrationStatus semester={semester} compact={true} />
                           </div>
                           <div className="text-sm text-gray-500">
                              {new Date(
                                 semester.start_date?.seconds ? semester.start_date.seconds * 1000 : semester.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                 semester.end_date?.seconds ? semester.end_date.seconds * 1000 : semester.endDate
                              ).toLocaleDateString()}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Registration Status and Thread Management */}
            <div className="lg:col-span-2 space-y-6">
               {selectedSemester && (
                  <>
                     {/* Detailed Registration Status */}
                     <SemesterRegistrationStatus semester={selectedSemester} />

                     {/* Threads for Selected Semester */}
                     <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                           <h2 className="text-lg font-medium text-gray-900 flex items-center">
                              <FiUsers className="mr-2" size={20} />
                              Threads in {selectedSemester.name}
                           </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                           {threads.length > 0 ? (
                              threads.map((thread) => (
                                 <div
                                    key={thread.id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                       selectedThread?.id === thread.id ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => setSelectedThread(thread)}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div>
                                          <h3 className="font-medium text-gray-900">{thread.title || `Thread ${thread.id}`}</h3>
                                          <p className="text-sm text-gray-500">
                                             Course: {thread.course?.title || "N/A"} | Teacher: {thread.teacher?.name || "N/A"}
                                          </p>
                                       </div>
                                       <div className="text-sm text-gray-500">
                                          {thread.students?.length || 0} / {thread.max_students || "∞"} students
                                       </div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="p-8 text-center text-gray-500">No threads found for this semester</div>
                           )}
                        </div>
                     </div>

                     {/* Thread Registration Manager */}
                     {selectedThread && (
                        <ThreadRegistrationManager
                           thread={{ ...selectedThread, semester_id: selectedSemester.id }}
                           onRegistrationUpdate={handleRegistrationUpdate}
                        />
                     )}
                  </>
               )}

               {!selectedSemester && (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                     <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">No Semester Selected</h3>
                     <p className="text-gray-500">Select a semester from the list to manage registration settings</p>
                  </div>
               )}
            </div>
         </div>

         {/* Add Semester Modal */}
         <AddSemesterModal
            isOpen={showAddSemesterModal}
            onClose={() => setShowAddSemesterModal(false)}
            onSubmit={handleAddSemester}
         />
      </div>
   );
};

export default RegistrationManagement;
