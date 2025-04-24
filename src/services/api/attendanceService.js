import apiClient from './apiClient';
import { MOCK_ATTENDANCE } from './mockData';

// For development/testing - use mock data
const MOCK_API = true;

const attendanceService = {
  getAttendanceRecords: async (threadId, date) => {
    if (MOCK_API) {
      let records = MOCK_ATTENDANCE;
      
      if (threadId) {
        records = records.filter(r => r.threadId === parseInt(threadId));
      }
      
      if (date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        records = records.filter(r => r.date.startsWith(dateStr));
      }
      
      return records;
    } else {
      const params = {};
      if (threadId) params.threadId = threadId;
      if (date) params.date = date;
      
      const response = await apiClient.get('/attendance', { params });
      return response.data;
    }
  },
  
  createAttendanceRecord: async (attendanceData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_ATTENDANCE.map(a => a.id)) + 1;
      
      // Create new attendance record
      const newAttendance = {
        id: newId,
        ...attendanceData,
      };
      
      // Add to mock data
      MOCK_ATTENDANCE.push(newAttendance);
      
      return newAttendance;
    } else {
      const response = await apiClient.post('/attendance', attendanceData);
      return response.data;
    }
  },
  
  updateAttendanceRecord: async (id, attendanceData) => {
    if (MOCK_API) {
      const index = MOCK_ATTENDANCE.findIndex(a => a.id === parseInt(id));
      if (index === -1) throw new Error('Attendance record not found');
      
      // Update attendance record
      const updatedAttendance = {
        ...MOCK_ATTENDANCE[index],
        ...attendanceData,
      };
      
      // Replace in mock data
      MOCK_ATTENDANCE[index] = updatedAttendance;
      
      return updatedAttendance;
    } else {
      const response = await apiClient.put(`/attendance/${id}`, attendanceData);
      return response.data;
    }
  },
  
  deleteAttendanceRecord: async (id) => {
    if (MOCK_API) {
      const index = MOCK_ATTENDANCE.findIndex(a => a.id === parseInt(id));
      if (index === -1) throw new Error('Attendance record not found');
      
      // Remove from mock data
      MOCK_ATTENDANCE.splice(index, 1);
      
      return { success: true };
    } else {
      const response = await apiClient.delete(`/attendance/${id}`);
      return response.data;
    }
  },
  
  getAttendanceStats: async (threadId) => {
    if (MOCK_API) {
      if (!threadId) throw new Error('Thread ID is required');
      
      const records = MOCK_ATTENDANCE.filter(r => r.threadId === parseInt(threadId));
      
      // Calculate attendance stats
      const studentStats = {};
      let totalSessions = records.length;
      
      records.forEach(record => {
        record.records.forEach(studentRecord => {
          if (!studentStats[studentRecord.studentId]) {
            studentStats[studentRecord.studentId] = {
              studentId: studentRecord.studentId,
              present: 0,
              absent: 0,
              late: 0,
              total: 0,
            };
          }
          
          studentStats[studentRecord.studentId].total += 1;
          
          if (studentRecord.status === 'PRESENT') {
            studentStats[studentRecord.studentId].present += 1;
          } else if (studentRecord.status === 'ABSENT') {
            studentStats[studentRecord.studentId].absent += 1;
          } else if (studentRecord.status === 'LATE') {
            studentStats[studentRecord.studentId].late += 1;
          }
        });
      });
      
      return {
        totalSessions,
        studentStats: Object.values(studentStats),
      };
    } else {
      const response = await apiClient.get(`/attendance/stats/${threadId}`);
      return response.data;
    }
  },
};

export default attendanceService;
