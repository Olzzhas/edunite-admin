import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads } from "../store/slices/threadSlice";
import { fetchAssignmentGroups } from "../store/slices/assignmentSlice";
import { FiFilter, FiFileText, FiCalendar, FiPaperclip, FiPlus } from "react-icons/fi";

const Assignments = () => {
   const dispatch = useDispatch();
   const { threads } = useSelector((state) => state.threads);
   const { assignmentGroups, loading, error } = useSelector((state) => state.assignments);

   const [selectedThreadId, setSelectedThreadId] = useState("");

   useEffect(() => {
      dispatch(fetchThreads({ page: 0, size: 100 }));
   }, [dispatch]);

   useEffect(() => {
      if (selectedThreadId) {
         dispatch(fetchAssignmentGroups(selectedThreadId));
      }
   }, [dispatch, selectedThreadId]);

   const handleThreadChange = (e) => {
      setSelectedThreadId(e.target.value);
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Assignments</h1>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
               <FiPlus className="mr-2" /> Create Assignment Group
            </button>
         </div>

         {/* Thread Selection */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
               <div className="flex-1 min-w-[300px]">
                  <label htmlFor="threadId" className="block text-sm font-medium text-gray-700 mb-1">
                     Select Thread
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFilter className="text-gray-400" />
                     </div>
                     <select
                        id="threadId"
                        name="threadId"
                        value={selectedThreadId}
                        onChange={handleThreadChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">Select a Thread</option>
                        {threads.map((thread) => (
                           <option key={thread.id} value={thread.id}>
                              Thread #{thread.id} - Course #{thread.courseId}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Assignment Groups */}
         {!selectedThreadId ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
               Please select a thread to view assignments
            </div>
         ) : loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center">
               <svg
                  className="animate-spin h-8 w-8 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
               >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
               </svg>
            </div>
         ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-red-500">{error}</div>
         ) : !assignmentGroups[selectedThreadId] || assignmentGroups[selectedThreadId].length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
               No assignment groups found for this thread
            </div>
         ) : (
            <div className="space-y-6">
               {assignmentGroups[selectedThreadId].map((group) => (
                  <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                     <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                           <p className="text-sm text-gray-600">Weight: {group.weight}%</p>
                        </div>
                        <div className="flex space-x-2">
                           <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200">
                              Edit
                           </button>
                           <button className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md border border-primary-200">
                              <FiPlus className="inline mr-1" /> Add Assignment
                           </button>
                        </div>
                     </div>

                     {/* Assignments */}
                     <div className="divide-y divide-gray-200">
                        {!group.assignments || group.assignments.length === 0 ? (
                           <div className="p-6 text-center text-gray-500">No assignments in this group</div>
                        ) : (
                           group.assignments &&
                           group.assignments.map((assignment) => (
                              <div key={assignment.id} className="p-6 hover:bg-gray-50">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <h4 className="text-md font-medium text-gray-900 mb-1">{assignment.title}</h4>
                                       <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>

                                       <div className="flex items-center text-sm text-gray-500 mt-3">
                                          <div className="flex items-center mr-4">
                                             <FiCalendar className="mr-1" />
                                             <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                                          </div>
                                          <div className="flex items-center">
                                             <FiFileText className="mr-1" />
                                             <span>Week {assignment.weekId}</span>
                                          </div>
                                       </div>

                                       {/* Attachments */}
                                       {assignment.attachments && assignment.attachments.length > 0 && (
                                          <div className="mt-3">
                                             <h5 className="text-xs font-medium text-gray-700 mb-1">Attachments:</h5>
                                             <div className="space-y-1">
                                                {assignment.attachments.map((attachment) => (
                                                   <div
                                                      key={attachment.id}
                                                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                                                   >
                                                      <FiPaperclip className="mr-1" />
                                                      <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                         {attachment.name}
                                                      </a>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    <div className="flex space-x-2">
                                       <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200">
                                          Edit
                                       </button>
                                       <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200">
                                          Delete
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default Assignments;
