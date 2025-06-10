import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateStudentDegreeStatus, fetchAllStudentDegrees } from "../../store/slices/studentDegreeSlice";
import { FiX } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";

const EditStudentDegreeModal = ({ isOpen, onClose, studentDegree, students, degrees }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    actual_graduation_date: "",
    final_gpa: "",
  });

  useEffect(() => {
    if (studentDegree) {
      setFormData({
        status: studentDegree.status || "",
        actual_graduation_date: studentDegree.actual_graduation_date 
          ? new Date(studentDegree.actual_graduation_date).toISOString().split('T')[0] 
          : "",
        final_gpa: studentDegree.final_gpa?.toString() || "",
      });
    }
  }, [studentDegree]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentDegree) return;
    
    setLoading(true);

    try {
      const statusData = {
        status: formData.status,
        actual_graduation_date: formData.actual_graduation_date || null,
        final_gpa: formData.final_gpa ? parseFloat(formData.final_gpa) : null,
      };

      await dispatch(updateStudentDegreeStatus({ 
        studentDegreeId: studentDegree.id, 
        statusData 
      })).unwrap();
      
      // Refresh the student degrees list
      dispatch(fetchAllStudentDegrees({ page: 1, pageSize: 10 }));
      
      addToast("Student degree updated successfully!", "success");
      onClose();
    } catch (error) {
      addToast(`Failed to update student degree: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getStudentName = (userId) => {
    const student = students?.find(s => s.id === userId);
    return student ? `${student.name} ${student.surname}` : `Student #${userId}`;
  };

  const getDegreeName = (degreeId) => {
    const degree = degrees?.find(d => d.id === degreeId);
    return degree ? degree.name : `Degree #${degreeId}`;
  };

  if (!isOpen || !studentDegree) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-sf-regular">Edit Student Degree</h2>
            <p className="text-sm text-gray-600">
              {getStudentName(studentDegree.user_id)} - {getDegreeName(studentDegree.degree_id)}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="WITHDRAWN">Withdrawn</option>
                <option value="TRANSFERRED">Transferred</option>
              </select>
            </div>

            {(formData.status === "COMPLETED" || formData.status === "WITHDRAWN") && (
              <div>
                <label htmlFor="actual_graduation_date" className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.status === "COMPLETED" ? "Graduation Date" : "Withdrawal Date"}
                </label>
                <input
                  type="date"
                  id="actual_graduation_date"
                  name="actual_graduation_date"
                  value={formData.actual_graduation_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                />
              </div>
            )}

            {formData.status === "COMPLETED" && (
              <div>
                <label htmlFor="final_gpa" className="block text-sm font-medium text-gray-700 mb-1">
                  Final GPA
                </label>
                <input
                  type="number"
                  id="final_gpa"
                  name="final_gpa"
                  value={formData.final_gpa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 3.67"
                  min="0"
                  max="4"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            )}

            {/* Display current information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Start Date: {new Date(studentDegree.start_date).toLocaleDateString()}</p>
                {studentDegree.expected_graduation_date && (
                  <p>Expected Graduation: {new Date(studentDegree.expected_graduation_date).toLocaleDateString()}</p>
                )}
                <p>Current Status: {studentDegree.status?.replace('_', ' ')}</p>
              </div>
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
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentDegreeModal;
