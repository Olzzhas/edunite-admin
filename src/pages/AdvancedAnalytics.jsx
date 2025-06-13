import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { analyticsService } from '../services/api';

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [popularCourses, setPopularCourses] = useState(null);
  const [studentEngagement, setStudentEngagement] = useState(null);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [teacherActivity, setTeacherActivity] = useState(null);
  const [attendanceTrends, setAttendanceTrends] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvancedAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [courses, engagement, performance, teachers, attendance] = await Promise.all([
          analyticsService.getPopularCourses(),
          analyticsService.getStudentEngagement(),
          analyticsService.getStudentPerformance(),
          analyticsService.getTeacherActivity(),
          analyticsService.getAttendanceTrends()
        ]);

        setPopularCourses(courses);
        setStudentEngagement(engagement);
        setStudentPerformance(performance);
        setTeacherActivity(teachers);
        setAttendanceTrends(attendance);
      } catch (err) {
        console.error('Error fetching advanced analytics:', err);
        setError('Failed to load advanced analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvancedAnalytics();
  }, []);

  // Transform grade distribution data for chart
  const getGradeDistributionData = () => {
    if (!studentPerformance) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: studentPerformance.grades.distribution.map(item => item.grade),
      datasets: [
        {
          label: 'Grade Distribution',
          data: studentPerformance.grades.distribution.map(item => item.count),
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',   // Green for A
            'rgba(59, 130, 246, 0.7)',  // Blue for B
            'rgba(251, 191, 36, 0.7)',  // Yellow for C
            'rgba(249, 115, 22, 0.7)',  // Orange for D
            'rgba(239, 68, 68, 0.7)',   // Red for F
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  // Transform engagement levels data for chart
  const getEngagementLevelsData = () => {
    if (!studentEngagement) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: studentEngagement.engagement_levels.map(item => item.level),
      datasets: [
        {
          data: studentEngagement.engagement_levels.map(item => item.count),
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',   // Green for High
            'rgba(251, 191, 36, 0.7)',  // Yellow for Medium
            'rgba(239, 68, 68, 0.7)',   // Red for Low
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  // Transform attendance by day data for chart
  const getAttendanceByDayData = () => {
    if (!attendanceTrends) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: attendanceTrends.by_day_of_week.map(item => item.day),
      datasets: [
        {
          label: 'Attendance Rate (%)',
          data: attendanceTrends.by_day_of_week.map(item => item.rate),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Advanced Analytics</h1>

      {/* Popular Courses */}
      <Card title="Popular Courses" className="mb-6">
        {popularCourses && (
          <div className="space-y-4">
            {popularCourses.courses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {course.enrollments} enrollments • {course.completions} completions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">⭐ {course.rating}</p>
                  <span className={`text-xs ${course.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {course.trend === 'up' ? '↗' : '↘'} {course.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Student Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Student Engagement Levels">
          <Chart 
            type="doughnut" 
            data={getEngagementLevelsData()} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }}
          />
        </Card>

        <Card title="Grade Distribution">
          <Chart 
            type="bar" 
            data={getGradeDistributionData()} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </Card>
      </div>

      {/* Attendance Trends */}
      <Card title="Attendance by Day of Week" className="mb-6">
        <Chart 
          type="bar" 
          data={getAttendanceByDayData()} 
          options={{
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { 
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }}
        />
      </Card>

      {/* Teacher Activity */}
      <Card title="Teacher Activity" className="mb-6">
        {teacherActivity && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{teacherActivity.metrics.totalTeachers}</p>
                <p className="text-sm text-gray-500">Total Teachers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{teacherActivity.metrics.activeTeachers}</p>
                <p className="text-sm text-gray-500">Active Teachers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{teacherActivity.metrics.averageCoursesPerTeacher}</p>
                <p className="text-sm text-gray-500">Avg Courses/Teacher</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{teacherActivity.metrics.averageStudentsPerTeacher}</p>
                <p className="text-sm text-gray-500">Avg Students/Teacher</p>
              </div>
            </div>

            <div className="space-y-3">
              {teacherActivity.activity.map((teacher) => (
                <div key={teacher.teacherId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{teacher.name}</h4>
                    <p className="text-sm text-gray-500">
                      {teacher.coursesCount} courses • {teacher.studentsCount} students
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{teacher.engagementScore}/10</p>
                    <p className="text-xs text-gray-500">Engagement Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
