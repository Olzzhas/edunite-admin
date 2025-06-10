import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTranscript } from "../../store/slices/transcriptSlice";
import { FiX } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";

const CreateTranscriptModal = ({ isOpen, onClose, students, degrees }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    degree_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transcriptData = {
        user_id: parseInt(formData.user_id),
        degree_id: parseInt(formData.degree_id),
      };

      await dispatch(createTranscript(transcriptData)).unwrap();
      
      addToast("Transcript created successfully!", "success");
      onClose();
      
      // Reset form
      setFormData({
        user_id: "",
        degree_id: "",
      });
    } catch (error) {
      addToast(`Failed to create transcript: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form
      setFormData({
        user_id: "",
        degree_id: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-sf-regular">Create Academic Transcript</h2>
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
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select a student</option>
                {students && students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.surname} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="degree_id" className="block text-sm font-medium text-gray-700 mb-1">
                Degree Program *
              </label>
              <select
                id="degree_id"
                name="degree_id"
                value={formData.degree_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="">Select a degree program</option>
                {degrees && Array.isArray(degrees) && degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name} ({degree.level})
                  </option>
                ))}
              </select>
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
              {loading ? "Creating..." : "Create Transcript"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTranscriptModal;
