import apiClient from './apiClient';

// Use real API data - set to true for testing with mock data
const MOCK_API = true;

// Mock data for development
const MOCK_OVERVIEW = {
  stats: {
    totalUsers: {
      value: 2318,
      trend: "up",
      trendValue: "+6.08%",
      previousPeriodValue: 2185
    },
    totalCourses: {
      value: 156,
      trend: "up", 
      trendValue: "+15.03%",
      previousPeriodValue: 135
    },
    totalThreads: {
      value: 3671,
      trend: "down",
      trendValue: "-0.03%",
      previousPeriodValue: 3672
    },
    activeStudents: {
      value: 7265,
      trend: "up",
      trendValue: "+11.01%",
      previousPeriodValue: 6540
    }
  },
  period: "last_30_days"
};

const MOCK_USERS_TIMELINE = {
  timeline: [
    { date: "2024-01-01", totalUsers: 10000, newUsers: 150, activeUsers: 8500 },
    { date: "2024-01-02", totalUsers: 10150, newUsers: 200, activeUsers: 8700 },
    { date: "2024-01-03", totalUsers: 10350, newUsers: 180, activeUsers: 8900 },
    { date: "2024-01-04", totalUsers: 10530, newUsers: 220, activeUsers: 9100 },
    { date: "2024-01-05", totalUsers: 10750, newUsers: 190, activeUsers: 9300 },
    { date: "2024-01-06", totalUsers: 10940, newUsers: 160, activeUsers: 9200 },
    { date: "2024-01-07", totalUsers: 11100, newUsers: 140, activeUsers: 9000 }
  ],
  comparison: {
    previousPeriod: [
      { date: "2023-12-01", totalUsers: 5000, newUsers: 100, activeUsers: 4200 },
      { date: "2023-12-02", totalUsers: 5100, newUsers: 120, activeUsers: 4300 },
      { date: "2023-12-03", totalUsers: 5220, newUsers: 110, activeUsers: 4400 },
      { date: "2023-12-04", totalUsers: 5330, newUsers: 130, activeUsers: 4500 },
      { date: "2023-12-05", totalUsers: 5460, newUsers: 105, activeUsers: 4600 },
      { date: "2023-12-06", totalUsers: 5565, newUsers: 95, activeUsers: 4550 },
      { date: "2023-12-07", totalUsers: 5660, newUsers: 85, activeUsers: 4500 }
    ]
  }
};

const MOCK_USER_DEMOGRAPHICS = {
  devices: [
    { name: "Windows", value: 30, percentage: 30.0 },
    { name: "Mac", value: 25, percentage: 25.0 },
    { name: "Linux", value: 15, percentage: 15.0 },
    { name: "iOS", value: 20, percentage: 20.0 },
    { name: "Android", value: 15, percentage: 15.0 },
    { name: "Other", value: 5, percentage: 5.0 }
  ],
  locations: [
    { name: "Kazakhstan", value: 52.1, percentage: 52.1 },
    { name: "Russia", value: 22.8, percentage: 22.8 },
    { name: "USA", value: 13.9, percentage: 13.9 },
    { name: "Other", value: 11.2, percentage: 11.2 }
  ]
};

const MOCK_RECENT_ACTIVITIES = {
  activities: [
    {
      id: "ACT-001",
      type: "enrollment",
      user: { id: 123, name: "John Doe", email: "john@example.com" },
      course: { id: 45, title: "Introduction to Computer Science" },
      date: "2024-01-15T10:30:00Z",
      status: "completed"
    },
    {
      id: "ACT-002", 
      type: "assignment_submission",
      user: { id: 124, name: "Jane Smith", email: "jane@example.com" },
      assignment: { id: 67, title: "Final Project" },
      date: "2024-01-15T09:45:00Z",
      status: "pending"
    },
    {
      id: "ACT-003",
      type: "login",
      user: { id: 125, name: "Bob Johnson", email: "bob@example.com" },
      date: "2024-01-15T09:30:00Z",
      status: "completed"
    },
    {
      id: "ACT-004",
      type: "enrollment",
      user: { id: 126, name: "Alice Brown", email: "alice@example.com" },
      course: { id: 46, title: "Advanced Mathematics" },
      date: "2024-01-15T08:15:00Z",
      status: "completed"
    },
    {
      id: "ACT-005",
      type: "assignment_submission",
      user: { id: 127, name: "Charlie Wilson", email: "charlie@example.com" },
      assignment: { id: 68, title: "Midterm Exam" },
      date: "2024-01-14T16:20:00Z",
      status: "graded"
    }
  ]
};

const MOCK_DETAILED_STATS = {
  courseEnrollments: {
    timeline: [
      { date: "2024-01-01", enrollments: 12000, completions: 8500 },
      { date: "2024-01-02", enrollments: 12200, completions: 8600 },
      { date: "2024-01-03", enrollments: 12400, completions: 8700 },
      { date: "2024-01-04", enrollments: 12600, completions: 8800 },
      { date: "2024-01-05", enrollments: 12800, completions: 8900 },
      { date: "2024-01-06", enrollments: 13000, completions: 9000 },
      { date: "2024-01-07", enrollments: 13200, completions: 9100 },
      { date: "2024-01-08", enrollments: 13400, completions: 9200 },
      { date: "2024-01-09", enrollments: 13600, completions: 9300 },
      { date: "2024-01-10", enrollments: 13800, completions: 9400 },
      { date: "2024-01-11", enrollments: 14000, completions: 9500 },
      { date: "2024-01-12", enrollments: 14200, completions: 9600 }
    ],
    comparison: {
      previousPeriod: [
        { date: "2023-01-01", enrollments: 10000, completions: 7200 },
        { date: "2023-01-02", enrollments: 10100, completions: 7250 },
        { date: "2023-01-03", enrollments: 10200, completions: 7300 },
        { date: "2023-01-04", enrollments: 10300, completions: 7350 },
        { date: "2023-01-05", enrollments: 10400, completions: 7400 },
        { date: "2023-01-06", enrollments: 10500, completions: 7450 },
        { date: "2023-01-07", enrollments: 10600, completions: 7500 },
        { date: "2023-01-08", enrollments: 10700, completions: 7550 },
        { date: "2023-01-09", enrollments: 10800, completions: 7600 },
        { date: "2023-01-10", enrollments: 10900, completions: 7650 },
        { date: "2023-01-11", enrollments: 11000, completions: 7700 },
        { date: "2023-01-12", enrollments: 11100, completions: 7750 }
      ]
    }
  },
  userActivity: {
    daily: [
      { day: "Monday", activeUsers: 420 },
      { day: "Tuesday", activeUsers: 380 },
      { day: "Wednesday", activeUsers: 450 },
      { day: "Thursday", activeUsers: 520 },
      { day: "Friday", activeUsers: 490 },
      { day: "Saturday", activeUsers: 380 },
      { day: "Sunday", activeUsers: 320 }
    ]
  },
  trafficSources: [
    { source: "Direct", value: 35, percentage: 35.0 },
    { source: "Organic Search", value: 25, percentage: 25.0 },
    { source: "Referral", value: 15, percentage: 15.0 },
    { source: "Social Media", value: 15, percentage: 15.0 },
    { source: "Email", value: 8, percentage: 8.0 },
    { source: "Other", value: 2, percentage: 2.0 }
  ]
};

const MOCK_PERFORMANCE_METRICS = {
  metrics: {
    courseCompletionRate: {
      value: 3.2,
      unit: "%",
      trend: "up",
      change: "+0.5%",
      description: "Course completion rate"
    },
    averageGrade: {
      value: 85.20,
      unit: "points",
      trend: "up", 
      change: "+3.50",
      description: "Average assignment grade"
    },
    attendanceRate: {
      value: 42.8,
      unit: "%",
      trend: "down",
      change: "-2.1%", 
      description: "Average attendance rate"
    },
    averageSessionDuration: {
      value: "2m 45s",
      unit: "time",
      trend: "up",
      change: "+15s",
      description: "Average session duration"
    }
  }
};

const analyticsService = {
  // Dashboard Overview - основные метрики
  getOverview: async (period = 'last_30_days') => {
    if (MOCK_API) {
      return MOCK_OVERVIEW;
    } else {
      const response = await apiClient.get('/analytics/overview', {
        params: { period }
      });
      return response.data;
    }
  },

  // Пользователи по времени (график)
  getUsersTimeline: async (period = '30d', granularity = 'day') => {
    if (MOCK_API) {
      return MOCK_USERS_TIMELINE;
    } else {
      const response = await apiClient.get('/analytics/users-timeline', {
        params: { period, granularity }
      });
      return response.data;
    }
  },

  // Статистика по устройствам и локациям
  getUserDemographics: async () => {
    if (MOCK_API) {
      return MOCK_USER_DEMOGRAPHICS;
    } else {
      const response = await apiClient.get('/analytics/user-demographics');
      return response.data;
    }
  },

  // Последние активности
  getRecentActivities: async (limit = 10, type = 'all') => {
    if (MOCK_API) {
      let activities = MOCK_RECENT_ACTIVITIES.activities;
      
      if (type !== 'all') {
        activities = activities.filter(activity => activity.type === type);
      }
      
      return {
        activities: activities.slice(0, limit)
      };
    } else {
      const response = await apiClient.get('/analytics/recent-activities', {
        params: { limit, type }
      });
      return response.data;
    }
  },

  // Детальная аналитика
  getDetailedStats: async (period = '30d', metrics = 'activity') => {
    if (MOCK_API) {
      return MOCK_DETAILED_STATS;
    } else {
      const response = await apiClient.get('/analytics/detailed-stats', {
        params: { period, metrics }
      });
      return response.data;
    }
  },

  // Ключевые метрики производительности
  getPerformanceMetrics: async () => {
    if (MOCK_API) {
      return MOCK_PERFORMANCE_METRICS;
    } else {
      const response = await apiClient.get('/analytics/performance-metrics');
      return response.data;
    }
  },

  // Дополнительные эндпоинты
  getPopularCourses: async (limit = 10, period = '30d') => {
    if (MOCK_API) {
      return {
        courses: [
          {
            id: 1,
            title: "Introduction to Computer Science",
            enrollments: 245,
            completions: 189,
            rating: 4.8,
            trend: "up"
          },
          {
            id: 2,
            title: "Advanced Mathematics",
            enrollments: 198,
            completions: 156,
            rating: 4.6,
            trend: "up"
          },
          {
            id: 3,
            title: "Web Development Fundamentals",
            enrollments: 167,
            completions: 134,
            rating: 4.7,
            trend: "down"
          }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/courses/popular', {
        params: { limit, period }
      });
      return response.data;
    }
  },

  getCourseCompletionRates: async () => {
    if (MOCK_API) {
      return {
        overall: {
          completionRate: 76.5,
          averageTime: "45 days"
        },
        byCourse: [
          {
            courseId: 1,
            title: "Introduction to Computer Science",
            completionRate: 85.2,
            enrollments: 120,
            completions: 102
          },
          {
            courseId: 2,
            title: "Advanced Mathematics",
            completionRate: 78.9,
            enrollments: 95,
            completions: 75
          }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/courses/completion-rates');
      return response.data;
    }
  },

  getStudentEngagement: async () => {
    if (MOCK_API) {
      return {
        metrics: {
          dailyActiveUsers: 1250,
          weeklyActiveUsers: 3400,
          monthlyActiveUsers: 8900,
          averageSessionTime: "25m 30s",
          averageCoursesPerStudent: 2.3
        },
        engagement_levels: [
          { level: "High", count: 450, percentage: 35.2 },
          { level: "Medium", count: 600, percentage: 46.9 },
          { level: "Low", count: 230, percentage: 17.9 }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/students/engagement');
      return response.data;
    }
  },

  getStudentPerformance: async () => {
    if (MOCK_API) {
      return {
        grades: {
          average: 78.5,
          median: 82.0,
          distribution: [
            { grade: "A", count: 120, percentage: 25.0 },
            { grade: "B", count: 180, percentage: 37.5 },
            { grade: "C", count: 150, percentage: 31.25 },
            { grade: "D", count: 25, percentage: 5.2 },
            { grade: "F", count: 5, percentage: 1.05 }
          ]
        },
        trends: {
          improving: 65,
          stable: 25,
          declining: 10
        }
      };
    } else {
      const response = await apiClient.get('/analytics/students/performance');
      return response.data;
    }
  },

  getTeacherActivity: async () => {
    if (MOCK_API) {
      return {
        metrics: {
          totalTeachers: 45,
          activeTeachers: 42,
          averageCoursesPerTeacher: 3.2,
          averageStudentsPerTeacher: 85
        },
        activity: [
          {
            teacherId: 1,
            name: "John Smith",
            coursesCount: 4,
            studentsCount: 120,
            lastActivity: "2024-01-15T10:30:00Z",
            engagementScore: 8.5
          },
          {
            teacherId: 2,
            name: "Jane Doe",
            coursesCount: 3,
            studentsCount: 95,
            lastActivity: "2024-01-15T09:45:00Z",
            engagementScore: 9.2
          }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/teachers/activity');
      return response.data;
    }
  },

  getAttendanceTrends: async () => {
    if (MOCK_API) {
      return {
        overall: {
          attendanceRate: 78.5,
          trend: "up",
          change: "+2.3%"
        },
        timeline: [
          {
            date: "2024-01-01",
            attendanceRate: 76.2,
            totalSessions: 45,
            attendedSessions: 34
          },
          {
            date: "2024-01-02",
            attendanceRate: 78.5,
            totalSessions: 48,
            attendedSessions: 38
          }
        ],
        by_day_of_week: [
          { day: "Monday", rate: 85.2 },
          { day: "Tuesday", rate: 82.1 },
          { day: "Wednesday", rate: 78.9 },
          { day: "Thursday", rate: 75.6 },
          { day: "Friday", rate: 68.3 }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/attendance/trends');
      return response.data;
    }
  },

  getPopularCourses: async (limit = 10) => {
    if (MOCK_API) {
      return {
        courses: [
          {
            id: 1,
            title: "Introduction to Computer Science",
            enrollments: 245,
            completions: 189,
            rating: 4.8,
            trend: "up"
          },
          {
            id: 2,
            title: "Advanced Mathematics",
            enrollments: 198,
            completions: 156,
            rating: 4.6,
            trend: "up"
          },
          {
            id: 3,
            title: "Web Development Fundamentals",
            enrollments: 167,
            completions: 134,
            rating: 4.7,
            trend: "stable"
          },
          {
            id: 4,
            title: "Data Structures & Algorithms",
            enrollments: 143,
            completions: 98,
            rating: 4.5,
            trend: "up"
          },
          {
            id: 5,
            title: "Database Management Systems",
            enrollments: 128,
            completions: 102,
            rating: 4.4,
            trend: "down"
          }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/courses/popular', {
        params: { limit }
      });
      return response.data;
    }
  },

  getCourseCompletionRates: async () => {
    if (MOCK_API) {
      return {
        overall: {
          completionRate: 76.5,
          averageTime: "45 days"
        },
        byCourse: [
          {
            courseId: 1,
            title: "Introduction to Computer Science",
            completionRate: 85.2,
            enrollments: 120,
            completions: 102
          },
          {
            courseId: 2,
            title: "Advanced Mathematics",
            completionRate: 78.9,
            enrollments: 95,
            completions: 75
          },
          {
            courseId: 3,
            title: "Web Development",
            completionRate: 80.1,
            enrollments: 88,
            completions: 70
          },
          {
            courseId: 4,
            title: "Data Structures",
            completionRate: 68.5,
            enrollments: 73,
            completions: 50
          },
          {
            courseId: 5,
            title: "Database Systems",
            completionRate: 79.7,
            enrollments: 64,
            completions: 51
          }
        ]
      };
    } else {
      const response = await apiClient.get('/analytics/courses/completion-rates');
      return response.data;
    }
  }
};

export default analyticsService;
