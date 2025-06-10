import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTranscriptEntry, fetchTranscriptEntries } from "../../store/slices/transcriptSlice";
import { FiX } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";

const AddTranscriptEntryModal = ({ isOpen, onClose, transcript, courses, semesters, threads }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    thread_id: "",
    semester_id: "",
    grade_letter: "",
    grade_numeric: "",
    grade_points: "",
    credits: "",
    is_transfer: false,
    is_repeated: false,
    completion_date: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGradeLetterChange = (e) => {
    const gradeLetter = e.target.value;
    let gradePoints = "";
    
    // Auto-calculate grade points based on letter grade
    switch (gradeLetter) {
      case "A+":
      case "A":
        gradePoints = "4.0";
        break;
      case "A-":
        gradePoints = "3.7";
        break;
      case "B+":
        gradePoints = "3.3";
        break;
      case "B":
        gradePoints = "3.0";
        break;
      case "B-":
        gradePoints = "2.7";
        break;
      case "C+":
        gradePoints = "2.3";
        break;
      case "C":
        gradePoints = "2.0";
        break;
      case "C-":
        gradePoints = "1.7";
        break;
      case "D":
        gradePoints = "1.0";
        break;
      case "F":
        gradePoints = "0.0";
        break;
      default:
        gradePoints = "";
    }

    setFormData((prev) => ({
      ...prev,
      grade_letter: gradeLetter,
      grade_points: gradePoints,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript) return;
    
    setLoading(true);

    try {
      const entryData = {
        transcript_id: transcript.id,
        course_id: parseInt(formData.course_id),
        thread_id: formData.thread_id ? parseInt(formData.thread_id) : null,
        semester_id: parseInt(formData.semester_id),
        grade_letter: formData.grade_letter,
        grade_numeric: parseFloat(formData.grade_numeric),
        grade_points: parseFloat(formData.grade_points),
        credits: parseInt(formData.credits),
        is_transfer: formData.is_transfer,
        is_repeated: formData.is_repeated,
        completion_date: formData.completion_date,
      };

      await dispatch(addTranscriptEntry(entryData)).unwrap();
      
      // Refresh transcript entries
      dispatch(fetchTranscriptEntries({ transcriptId: transcript.id }));
      
      addToast("Course grade added successfully!", "success");
      onClose();
      
      // Reset form
      setFormData({
        course_id: "",
        thread_id: "",
        semester_id: "",
        grade_letter: "",
        grade_numeric: "",
        grade_points: "",
        credits: "",
        is_transfer: false,
        is_repeated: false,
        completion_date: "",
      });
    } catch (error) {
      addToast(`Failed to add course grade: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form
      setFormData({
        course_id: "",
        thread_id: "",
        semester_id: "",
        grade_letter: "",
        grade_numeric: "",
        grade_points: "",
        credits: "",
        is_transfer: false,
        is_repeated: false,
        completion_date: "",
      });
    }
  };

  if (!isOpen || !transcript) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-sf-regular">Add Course Grade</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select a course</option>
                {courses && Array.isArray(courses) && courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="thread_id" className="block text-sm font-medium text-gray-700 mb-1">
                Thread (Optional)
              </label>
              <select
                id="thread_id"
                name="thread_id"
                value={formData.thread_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              >
                <option value="">Select a thread</option>
                {threads && Array.isArray(threads) && threads.map((thread) => (
                  <option key={thread.id} value={thread.id}>
                    {thread.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                id="semester_id"
                name="semester_id"
                value={formData.semester_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select a semester</option>
                {semesters && Array.isArray(semesters) && semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="grade_letter" className="block text-sm font-medium text-gray-700 mb-1">
                Letter Grade *
              </label>
              <select
                id="grade_letter"
                name="grade_letter"
                value={formData.grade_letter}
                onChange={handleGradeLetterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div>
              <label htmlFor="grade_numeric" className="block text-sm font-medium text-gray-700 mb-1">
                Numeric Grade *
              </label>
              <input
                type="number"
                id="grade_numeric"
                name="grade_numeric"
                value={formData.grade_numeric}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 95.0"
                min="0"
                max="100"
                step="0.1"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="grade_points" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Points *
              </label>
              <input
                type="number"
                id="grade_points"
                name="grade_points"
                value={formData.grade_points}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 4.0"
                min="0"
                max="4"
                step="0.1"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                Credits *
              </label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 3"
                min="1"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700 mb-1">
                Completion Date
              </label>
              <input
                type="date"
                id="completion_date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_transfer"
                name="is_transfer"
                checked={formData.is_transfer}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="is_transfer" className="ml-2 block text-sm text-gray-900">
                Transfer Credit
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_repeated"
                name="is_repeated"
                checked={formData.is_repeated}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="is_repeated" className="ml-2 block text-sm text-gray-900">
                Repeated Course
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Grade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTranscriptEntryModal;
