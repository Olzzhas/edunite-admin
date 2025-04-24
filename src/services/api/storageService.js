import apiClient from './apiClient';
import { MOCK_STORAGE_FILES } from './mockData';

// For development/testing - use mock data
const MOCK_API = true;

const storageService = {
  getFiles: async (bucket) => {
    if (MOCK_API) {
      const files = bucket 
        ? MOCK_STORAGE_FILES.filter(f => f.bucket === bucket)
        : MOCK_STORAGE_FILES;
      
      return files;
    } else {
      const response = await apiClient.get('/storage', { params: { bucket } });
      return response.data;
    }
  },
  
  uploadFile: async (file, bucket) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_STORAGE_FILES.map(f => f.id)) + 1;
      
      // Create new file record
      const newFile = {
        id: newId,
        bucket: bucket || 'default',
        object: file.name,
        size: file.size,
        contentType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 1, // Assuming current user is admin
      };
      
      // Add to mock data
      MOCK_STORAGE_FILES.push(newFile);
      
      return newFile;
    } else {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      if (bucket) formData.append('bucket', bucket);
      
      const response = await apiClient.post('/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    }
  },
  
  downloadFile: async (bucket, object) => {
    if (MOCK_API) {
      const file = MOCK_STORAGE_FILES.find(
        f => f.bucket === bucket && f.object === object
      );
      
      if (!file) throw new Error('File not found');
      
      // In a real implementation, this would download the file
      // For mock, we'll just return the file info
      return file;
    } else {
      const response = await apiClient.get(`/storage/download/${bucket}/${object}`, {
        responseType: 'blob',
      });
      
      return response.data;
    }
  },
  
  deleteFile: async (bucket, object) => {
    if (MOCK_API) {
      const index = MOCK_STORAGE_FILES.findIndex(
        f => f.bucket === bucket && f.object === object
      );
      
      if (index === -1) throw new Error('File not found');
      
      // Remove from mock data
      MOCK_STORAGE_FILES.splice(index, 1);
      
      return { success: true };
    } else {
      const response = await apiClient.delete(`/storage/${bucket}/${object}`);
      return response.data;
    }
  },
  
  getStorageStats: async () => {
    if (MOCK_API) {
      // Calculate total size by bucket
      const buckets = {};
      let totalSize = 0;
      
      MOCK_STORAGE_FILES.forEach(file => {
        if (!buckets[file.bucket]) {
          buckets[file.bucket] = {
            name: file.bucket,
            size: 0,
            fileCount: 0,
          };
        }
        
        buckets[file.bucket].size += file.size;
        buckets[file.bucket].fileCount += 1;
        totalSize += file.size;
      });
      
      return {
        totalSize,
        buckets: Object.values(buckets),
      };
    } else {
      const response = await apiClient.get('/storage/stats');
      return response.data;
    }
  },
};

export default storageService;
