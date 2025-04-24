import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSemesters } from '../store/slices/semesterSlice';
import { FiCalendar, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Semesters = () => {
  const dispatch = useDispatch();
  const { semesters, loading, error } = useSelector((state) => state.semesters);
  
  useEffect(() => {
    dispatch(fetchSemesters());
  }, [dispatch]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Semesters</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
          <FiPlus className="mr-2" /> Add Semester
        </button>
      </div>
      
      {/* Semesters List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : semesters.length === 0 ? (
          <div className="text-center py-12">No semesters found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {semesters.map((semester) => (
              <div key={semester.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{semester.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiCalendar className="mr-1" />
                      <span>
                        {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Semester Breaks */}
                    {semester.breaks && semester.breaks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Breaks:</h4>
                        <div className="space-y-2">
                          {semester.breaks.map((breakItem) => (
                            <div key={breakItem.id} className="flex items-center text-sm">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span className="font-medium mr-2">{breakItem.name}:</span>
                              <span className="text-gray-600">
                                {new Date(breakItem.startDate).toLocaleDateString()} - {new Date(breakItem.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <FiEdit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Add Break Button */}
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <FiPlus className="mr-1" /> Add Break
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Semesters;
