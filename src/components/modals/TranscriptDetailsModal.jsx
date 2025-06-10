import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTranscriptEntries, addTranscriptEntry } from "../../store/slices/transcriptSlice";
import { fetchCourses } from "../../store/slices/courseSlice";
import { fetchSemesters } from "../../store/slices/semesterSlice";
import { fetchThreads } from "../../store/slices/threadSlice";
import { FiX, FiPlus, FiBook, FiCalendar } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";
import AddTranscriptEntryModal from "./AddTranscriptEntryModal";

const TranscriptDetailsModal = ({ isOpen, onClose, transcript }) => {
  const dispatch = useDispatch();
  const { transcriptEntries, entriesLoading } = useSelector((state) => state.transcripts);
  const { courses } = useSelector((state) => state.courses);
  const { semesters } = useSelector((state) => state.semesters);
  const { threads } = useSelector((state) => state.threads);
  const { addToast } = useToast();

  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    if (transcript && isOpen) {
      dispatch(fetchTranscriptEntries({ transcriptId: transcript.id, semesterId: selectedSemester }));
      dispatch(fetchCourses({ page: 1, size: 100 }));
      dispatch(fetchSemesters());
      dispatch(fetchThreads({ page: 1, size: 100 }));
    }
  }, [dispatch, transcript, isOpen, selectedSemester]);

  const handleSemesterFilter = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleAddEntry = () => {
    setIsAddEntryModalOpen(true);
  };

  const handleCloseAddEntryModal = () => {
    setIsAddEntryModalOpen(false);
  };

  const getGradeColor = (gradeLetter) => {
    switch (gradeLetter) {
      case "A":
      case "A+":
        return "text-green-600";
      case "A-":
      case "B+":
        return "text-green-500";
      case "B":
      case "B-":
        return "text-blue-600";
      case "C+":
      case "C":
        return "text-yellow-600";
      case "C-":
      case "D":
        return "text-orange-600";
      case "F":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen || !transcript) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-sf-regular">Transcript Details</h2>
            <p className="text-sm text-gray-600">
              Student ID: {transcript.user_id} | GPA: {transcript.cumulative_gpa?.toFixed(2) || "0.00"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Filter and Add Entry */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="semesterFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Semester
                </label>
                <select
                  id="semesterFilter"
                  value={selectedSemester}
                  onChange={handleSemesterFilter}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Semesters</option>
                  {semesters && Array.isArray(semesters) && semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddEntry}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Add Course Grade
            </button>
          </div>

          {/* Transcript Entries */}
          {entriesLoading ? (
            <div className="flex justify-center py-12">
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
          ) : transcriptEntries.length === 0 ? (
            <div className="text-center py-12">
              <FiBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Grades</h3>
              <p className="text-gray-600">No course grades have been added to this transcript yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FiBook className="text-primary-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {entry.course_title || `Course #${entry.course_id}`}
                        </h3>
                        <span className={`ml-3 text-xl font-bold ${getGradeColor(entry.grade_letter)}`}>
                          {entry.grade_letter}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          <span>{entry.semester_name || `Semester #${entry.semester_id}`}</span>
                        </div>
                        <div>
                          <span>Credits: {entry.credits}</span>
                        </div>
                        <div>
                          <span>Grade Points: {entry.grade_points}</span>
                        </div>
                        <div>
                          <span>Numeric Grade: {entry.grade_numeric}</span>
                        </div>
                      </div>

                      {entry.completion_date && (
                        <div className="text-sm text-gray-500 mt-1">
                          Completed: {new Date(entry.completion_date).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mt-2">
                        {entry.is_transfer && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Transfer Credit
                          </span>
                        )}
                        {entry.is_repeated && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Repeated Course
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Entry Modal */}
        <AddTranscriptEntryModal
          isOpen={isAddEntryModalOpen}
          onClose={handleCloseAddEntryModal}
          transcript={transcript}
          courses={courses}
          semesters={semesters}
          threads={threads}
        />
      </div>
    </div>
  );
};

export default TranscriptDetailsModal;
