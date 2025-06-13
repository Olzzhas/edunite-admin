import apiClient from './apiClient';

const notificationService = {
  // Create notification (Admin and Teachers)
  createNotification: async (notificationData) => {
    try {
      console.log('NotificationService: Sending notification data:', notificationData);
      const response = await apiClient.post('/notifications', notificationData);
      console.log('NotificationService: Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('NotificationService: Error creating notification:', error);
      console.error('NotificationService: Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Create notification as teacher
  createTeacherNotification: async (notificationData) => {
    try {
      const response = await apiClient.post('/teacher/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating teacher notification:', error);
      throw error;
    }
  },

  // Get all notifications (Admin only)
  getAllNotifications: async (params = {}) => {
    try {
      const { page = 1, limit = 20, target_type, target_value } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (target_type) queryParams.append('target_type', target_type);
      if (target_value) queryParams.append('target_value', target_value);

      const response = await apiClient.get(`/notifications?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get user notifications
  getUserNotifications: async (userId, params = {}) => {
    try {
      const { page = 1, limit = 20, unread_only = false } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unread_only: unread_only.toString(),
      });

      const response = await apiClient.get(`/users/${userId}/notifications?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification (Admin only)
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get user notification stats
  getUserNotificationStats: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/notifications/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  // Get available email templates
  getEmailTemplates: async () => {
    try {
      console.log('NotificationService: Fetching email templates...');
      const response = await apiClient.get('/email-templates');
      console.log('NotificationService: Email templates response:', response.data);
      return response.data;
    } catch (error) {
      console.error('NotificationService: Error fetching email templates:', error);
      console.error('NotificationService: Email templates error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get available roles for targeting
  getRoles: async () => {
    try {
      const response = await apiClient.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get available degrees for targeting
  getDegrees: async () => {
    try {
      const response = await apiClient.get('/degrees');
      return response.data;
    } catch (error) {
      console.error('Error fetching degrees:', error);
      throw error;
    }
  },

  // Get available courses for targeting
  getCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get available threads for targeting
  getThreads: async () => {
    try {
      const response = await apiClient.get('/threads');
      return response.data;
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }
  },

  // Get users for targeting
  getUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 100, search } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) queryParams.append('search', search);

      const response = await apiClient.get(`/user/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};

export default notificationService;
