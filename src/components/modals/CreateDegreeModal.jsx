import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDegree, fetchDegrees } from "../../store/slices/degreeSlice";
import { FiX } from "react-icons/fi";
import { useToast } from "../../contexts/ToastContext";

const CreateDegreeModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "bachelor",
    description: "",
    required_credits: "",
    min_gpa: "",
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
      const degreeData = {
        ...formData,
        required_credits: parseInt(formData.required_credits),
        min_gpa: parseFloat(formData.min_gpa),
      };

      await dispatch(createDegree(degreeData)).unwrap();
      
      // Refresh the degrees list
      dispatch(fetchDegrees({ page: 1, pageSize: 10 }));
      
      addToast("Degree program created successfully!", "success");
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        level: "bachelor",
        description: "",
        required_credits: "",
        min_gpa: "",
      });
    } catch (error) {
      addToast(`Failed to create degree program: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form
      setFormData({
        name: "",
        level: "bachelor",
        description: "",
        required_credits: "",
        min_gpa: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-sf-regular">Create Degree Program</h2>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Degree Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Bachelor of Computer Science"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={loading}
              >
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description of the degree program"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="required_credits" className="block text-sm font-medium text-gray-700 mb-1">
                Required Credits *
              </label>
              <input
                type="number"
                id="required_credits"
                name="required_credits"
                value={formData.required_credits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 120"
                min="1"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="min_gpa" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum GPA *
              </label>
              <input
                type="number"
                id="min_gpa"
                name="min_gpa"
                value={formData.min_gpa}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2.0"
                min="0"
                max="4"
                step="0.1"
                required
                disabled={loading}
              />
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
              {loading ? "Creating..." : "Create Degree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDegreeModal;
