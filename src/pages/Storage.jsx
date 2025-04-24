import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, fetchStorageStats, uploadFile, deleteFile } from '../store/slices/storageSlice';
import { FiFolder, FiFile, FiUpload, FiTrash2, FiDownload, FiHardDrive } from 'react-icons/fi';

const Storage = () => {
  const dispatch = useDispatch();
  const { files, stats, loading, error } = useSelector((state) => state.storage);
  
  const [selectedBucket, setSelectedBucket] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);
  
  useEffect(() => {
    dispatch(fetchFiles(selectedBucket));
    dispatch(fetchStorageStats());
  }, [dispatch, selectedBucket]);
  
  const handleBucketChange = (e) => {
    setSelectedBucket(e.target.value);
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFile(file);
      dispatch(uploadFile({ file, bucket: selectedBucket }))
        .unwrap()
        .then(() => {
          setUploadingFile(null);
          e.target.value = null; // Reset the input
        })
        .catch(() => {
          setUploadingFile(null);
          e.target.value = null; // Reset the input
        });
    }
  };
  
  const handleFileDelete = (bucket, object) => {
    if (window.confirm(`Are you sure you want to delete ${object}?`)) {
      dispatch(deleteFile({ bucket, object }));
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Storage</h1>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={!selectedBucket || loading}
          />
          <label
            htmlFor="file-upload"
            className={`bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center cursor-pointer ${
              !selectedBucket || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadingFile ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
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
                Uploading...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" /> Upload File
              </>
            )}
          </label>
        </div>
      </div>
      
      {/* Storage Stats */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiHardDrive className="text-primary-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Total Storage</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatBytes(stats.totalSize)}</p>
            </div>
            
            {stats.buckets.map((bucket) => (
              <div key={bucket.name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiFolder className="text-primary-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">{bucket.name}</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatBytes(bucket.size)}</p>
                <p className="text-sm text-gray-600">{bucket.fileCount} files</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Bucket Selection */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <label htmlFor="bucket" className="block text-sm font-medium text-gray-700 mb-1">
              Select Bucket
            </label>
            <select
              id="bucket"
              name="bucket"
              value={selectedBucket}
              onChange={handleBucketChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Buckets</option>
              {stats &&
                stats.buckets.map((bucket) => (
                  <option key={bucket.name} value={bucket.name}>
                    {bucket.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Files List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading && !uploadingFile ? (
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
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No files found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    File
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bucket
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Uploaded
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={`${file.bucket}-${file.object}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiFile className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{file.object}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.bucket}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatBytes(file.size)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Download"
                      >
                        <FiDownload />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => handleFileDelete(file.bucket, file.object)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Storage;
