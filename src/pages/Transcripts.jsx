import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentTranscript, updateGPA, generateTranscriptReport } from "../store/slices/transcriptSlice";
import { fetchDegrees } from "../store/slices/degreeSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { FiSearch, FiUser, FiBook, FiFileText, FiPlus, FiRefreshCw, FiDownload } from "react-icons/fi";
import { useToast } from "../contexts/ToastContext";
import CreateTranscriptModal from "../components/modals/CreateTranscriptModal";
import TranscriptDetailsModal from "../components/modals/TranscriptDetailsModal";

const Transcripts = () => {
   const dispatch = useDispatch();
   const { currentTranscript, transcriptReport, loading, reportLoading, error } = useSelector((state) => state.transcripts);
   const { degrees } = useSelector((state) => state.degrees);
   const { users } = useSelector((state) => state.users);
   const { addToast } = useToast();

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
   const [searchForm, setSearchForm] = useState({
      userId: "",
      degreeId: "",
   });

   // Get students from users
   const students = users ? users.filter((user) => user.role === "student") : [];

   useEffect(() => {
      dispatch(fetchDegrees({ page: 1, pageSize: 100 }));
      dispatch(fetchUsers({ page: 1, size: 100 }));
   }, [dispatch]);

   const handleSearchFormChange = (e) => {
      const { name, value } = e.target;
      setSearchForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleSearchTranscript = (e) => {
      e.preventDefault();
      if (!searchForm.userId) {
         addToast("Please select a student", "error");
         return;
      }

      dispatch(
         fetchStudentTranscript({
            userId: parseInt(searchForm.userId),
            degreeId: searchForm.degreeId ? parseInt(searchForm.degreeId) : undefined,
         })
      )
         .unwrap()
         .then(() => {
            addToast("Transcript loaded successfully!", "success");
         })
         .catch((error) => {
            addToast(`Failed to load transcript: ${error}`, "error");
         });
   };

   const handleUpdateGPA = () => {
      if (!currentTranscript) {
         addToast("No transcript loaded", "error");
         return;
      }

      dispatch(updateGPA(currentTranscript.id))
         .unwrap()
         .then(() => {
            addToast("GPA updated successfully!", "success");
         })
         .catch((error) => {
            addToast(`Failed to update GPA: ${error}`, "error");
         });
   };

   const handleGenerateReport = () => {
      if (!currentTranscript) {
         addToast("No transcript loaded", "error");
         return;
      }

      const options = {
         includeTransferCredits: true,
         includeRepeatedCourses: false,
      };

      dispatch(
         generateTranscriptReport({
            userId: currentTranscript.user_id,
            degreeId: currentTranscript.degree_id,
            options,
         })
      )
         .unwrap()
         .then(() => {
            addToast("Transcript report generated successfully!", "success");
         })
         .catch((error) => {
            addToast(`Failed to generate report: ${error}`, "error");
         });
   };

   const handleOpenCreateModal = () => {
      setIsCreateModalOpen(true);
   };

   const handleCloseCreateModal = () => {
      setIsCreateModalOpen(false);
   };

   const handleOpenDetailsModal = () => {
      if (!currentTranscript) {
         addToast("No transcript loaded", "error");
         return;
      }
      setIsDetailsModalOpen(true);
   };

   const handleCloseDetailsModal = () => {
      setIsDetailsModalOpen(false);
   };

   const getAcademicStandingColor = (standing) => {
      switch (standing) {
         case "GOOD_STANDING":
            return "bg-green-100 text-green-800";
         case "ACADEMIC_WARNING":
            return "bg-yellow-100 text-yellow-800";
         case "ACADEMIC_PROBATION":
            return "bg-orange-100 text-orange-800";
         case "ACADEMIC_SUSPENSION":
         case "DISMISSED":
            return "bg-red-100 text-red-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   const getAcademicStandingDisplay = (standing) => {
      switch (standing) {
         case "GOOD_STANDING":
            return "Good Standing";
         case "ACADEMIC_WARNING":
            return "Academic Warning";
         case "ACADEMIC_PROBATION":
            return "Academic Probation";
         case "ACADEMIC_SUSPENSION":
            return "Academic Suspension";
         case "DISMISSED":
            return "Dismissed";
         default:
            return standing;
      }
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Academic Transcripts</h1>
            <button
               className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
               onClick={handleOpenCreateModal}
            >
               <FiPlus className="mr-2" /> Create Transcript
            </button>
         </div>

         {/* Search Form */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handleSearchTranscript} className="flex flex-wrap gap-4">
               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                     Student
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                     </div>
                     <select
                        id="userId"
                        name="userId"
                        value={searchForm.userId}
                        onChange={handleSearchFormChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                     >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                           <option key={student.id} value={student.id}>
                              {student.name} {student.surname} ({student.email})
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="flex-1 min-w-[200px]">
                  <label htmlFor="degreeId" className="block text-sm font-medium text-gray-700 mb-1">
                     Degree Program (Optional)
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBook className="text-gray-400" />
                     </div>
                     <select
                        id="degreeId"
                        name="degreeId"
                        value={searchForm.degreeId}
                        onChange={handleSearchFormChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     >
                        <option value="">All degree programs</option>
                        {degrees &&
                           Array.isArray(degrees) &&
                           degrees.map((degree) => (
                              <option key={degree.id} value={degree.id}>
                                 {degree.name}
                              </option>
                           ))}
                     </select>
                  </div>
               </div>

               <div className="flex items-end">
                  <button
                     type="submit"
                     className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
                     disabled={loading}
                  >
                     <FiSearch className="mr-2" />
                     {loading ? "Searching..." : "Search Transcript"}
                  </button>
               </div>
            </form>
         </div>

         {/* Transcript Display */}
         {currentTranscript && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <h2 className="text-xl font-sf-regular text-gray-900 mb-2">Academic Transcript</h2>
                     <div className="text-sm text-gray-600">
                        <p>Student ID: {currentTranscript.user_id}</p>
                        {currentTranscript.degree && <p>Degree: {currentTranscript.degree.name}</p>}
                     </div>
                  </div>
                  <div className="flex space-x-2">
                     <button
                        onClick={handleUpdateGPA}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 flex items-center"
                        disabled={loading}
                     >
                        <FiRefreshCw className="mr-1" size={14} /> Update GPA
                     </button>
                     <button
                        onClick={handleGenerateReport}
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md border border-green-200 flex items-center"
                        disabled={reportLoading}
                     >
                        <FiDownload className="mr-1" size={14} /> Generate Report
                     </button>
                     <button
                        onClick={handleOpenDetailsModal}
                        className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-md border border-purple-200 flex items-center"
                     >
                        <FiFileText className="mr-1" size={14} /> View Details
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <h3 className="text-sm font-medium text-gray-700 mb-1">Cumulative GPA</h3>
                     <p className="text-2xl font-bold text-primary-600">
                        {currentTranscript.cumulative_gpa?.toFixed(2) || "0.00"}
                     </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <h3 className="text-sm font-medium text-gray-700 mb-1">Credits Earned</h3>
                     <p className="text-2xl font-bold text-green-600">{currentTranscript.total_credits_earned || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <h3 className="text-sm font-medium text-gray-700 mb-1">Credits Attempted</h3>
                     <p className="text-2xl font-bold text-blue-600">{currentTranscript.total_credits_attempted || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <h3 className="text-sm font-medium text-gray-700 mb-1">Academic Standing</h3>
                     <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getAcademicStandingColor(
                           currentTranscript.academic_standing
                        )}`}
                     >
                        {getAcademicStandingDisplay(currentTranscript.academic_standing)}
                     </span>
                  </div>
               </div>
            </div>
         )}

         {/* Error Display */}
         {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
               <p className="text-red-800">{error}</p>
            </div>
         )}

         {/* No Transcript Message */}
         {!currentTranscript && !loading && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
               <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">No Transcript Loaded</h3>
               <p className="text-gray-600">Search for a student to view their academic transcript.</p>
            </div>
         )}

         {/* Modals */}
         <CreateTranscriptModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            students={students}
            degrees={degrees}
         />
         <TranscriptDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} transcript={currentTranscript} />
      </div>
   );
};

export default Transcripts;
