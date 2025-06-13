import React, { useState, useEffect } from "react";
import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiEye, FiArrowUp, FiArrowRight, FiArrowDown } from "react-icons/fi";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import Chart from "../components/Chart";
import { analyticsService } from "../services/api";

const Dashboard = () => {
   const [loading, setLoading] = useState(true);
   const [overviewData, setOverviewData] = useState(null);
   const [usersTimelineData, setUsersTimelineData] = useState(null);
   const [recentActivitiesData, setRecentActivitiesData] = useState(null);
   const [popularCoursesData, setPopularCoursesData] = useState(null);
   const [studentPerformanceData, setStudentPerformanceData] = useState(null);
   const [courseCompletionData, setCourseCompletionData] = useState(null);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);
            setError(null);

            const [overview, usersTimeline, recentActivities, popularCourses, studentPerformance, courseCompletionRates] =
               await Promise.all([
                  analyticsService.getOverview(),
                  analyticsService.getUsersTimeline(),
                  analyticsService.getRecentActivities(5),
                  analyticsService.getPopularCourses(5),
                  analyticsService.getStudentPerformance(),
                  analyticsService.getCourseCompletionRates(),
               ]);

            setOverviewData(overview);
            setUsersTimelineData(usersTimeline);
            setRecentActivitiesData(recentActivities);
            setPopularCoursesData(popularCourses);
            setStudentPerformanceData(studentPerformance);
            setCourseCompletionData(courseCompletionRates);
         } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   // Transform overview data to stats format
   const getStatsFromOverview = () => {
      if (!overviewData) return [];

      const getTrendIcon = (trend) => {
         switch (trend) {
            case "up":
               return <FiArrowUp size={14} />;
            case "down":
               return <FiArrowDown size={14} />;
            default:
               return <FiArrowRight size={14} />;
         }
      };

      return [
         {
            title: "Active Students",
            value: overviewData.stats.activeStudents.value.toLocaleString(),
            trendIcon: getTrendIcon(overviewData.stats.activeStudents.trend),
            trend: overviewData.stats.activeStudents.trend,
            trendValue: overviewData.stats.activeStudents.trendValue,
         },
         {
            title: "Total Threads",
            value: overviewData.stats.totalThreads.value.toLocaleString(),
            trendIcon: getTrendIcon(overviewData.stats.totalThreads.trend),
            trend: overviewData.stats.totalThreads.trend,
            trendValue: overviewData.stats.totalThreads.trendValue,
         },
         {
            title: "Total Courses",
            value: overviewData.stats.totalCourses.value.toLocaleString(),
            trendIcon: getTrendIcon(overviewData.stats.totalCourses.trend),
            trend: overviewData.stats.totalCourses.trend,
            trendValue: overviewData.stats.totalCourses.trendValue,
         },
         {
            title: "Total Users",
            value: overviewData.stats.totalUsers.value.toLocaleString(),
            trendIcon: getTrendIcon(overviewData.stats.totalUsers.trend),
            trend: overviewData.stats.totalUsers.trend,
            trendValue: overviewData.stats.totalUsers.trendValue,
         },
      ];
   };

   const stats = getStatsFromOverview();

   // Transform users timeline data for chart
   const getUsersChartData = () => {
      if (!usersTimelineData) {
         return {
            labels: [],
            datasets: [],
         };
      }

      const currentLabels = usersTimelineData.timeline.map((item) =>
         new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
      const currentData = usersTimelineData.timeline.map((item) => item.totalUsers);

      const previousLabels = usersTimelineData.comparison.previousPeriod.map((item) =>
         new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
      const previousData = usersTimelineData.comparison.previousPeriod.map((item) => item.totalUsers);

      return {
         labels: currentLabels,
         datasets: [
            {
               label: "This period",
               data: currentData,
               borderColor: "rgb(79, 70, 229)", // Indigo
               backgroundColor: "rgba(79, 70, 229, 0.1)",
               tension: 0.4,
               borderWidth: 2,
            },
            {
               label: "Previous period",
               data: previousData,
               borderColor: "rgb(209, 213, 219)", // Gray
               backgroundColor: "rgba(209, 213, 219, 0.1)",
               tension: 0.4,
               borderWidth: 2,
               borderDash: [5, 5],
            },
         ],
      };
   };

   const usersChartData = getUsersChartData();

   // Transform student performance data for charts
   const getPerformanceChartData = () => {
      if (!studentPerformanceData) {
         return {
            labels: [],
            datasets: [],
         };
      }

      return {
         labels: studentPerformanceData.grades.distribution.map((grade) => grade.grade),
         datasets: [
            {
               label: "Students",
               data: studentPerformanceData.grades.distribution.map((grade) => grade.count),
               backgroundColor: [
                  "rgba(34, 197, 94, 0.7)", // A - Green
                  "rgba(59, 130, 246, 0.7)", // B - Blue
                  "rgba(255, 193, 7, 0.7)", // C - Yellow
                  "rgba(255, 159, 64, 0.7)", // D - Orange
                  "rgba(239, 68, 68, 0.7)", // F - Red
               ],
               borderWidth: 0,
            },
         ],
      };
   };

   // Transform course completion data for charts
   const getCompletionChartData = () => {
      if (!courseCompletionData) {
         return {
            labels: [],
            datasets: [],
         };
      }

      return {
         labels: courseCompletionData.byCourse.slice(0, 5).map((course) => course.title),
         datasets: [
            {
               data: courseCompletionData.byCourse.slice(0, 5).map((course) => course.completionRate),
               backgroundColor: [
                  "rgba(139, 92, 246, 0.7)", // Purple
                  "rgba(16, 185, 129, 0.7)", // Green
                  "rgba(59, 130, 246, 0.7)", // Blue
                  "rgba(255, 159, 64, 0.7)", // Orange
                  "rgba(209, 213, 219, 0.7)", // Gray
               ],
               borderWidth: 0,
            },
         ],
      };
   };

   const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
               boxWidth: 8,
               usePointStyle: true,
               pointStyle: "circle",
            },
         },
         tooltip: {
            mode: "index",
            intersect: false,
         },
      },
      scales: {
         x: {
            grid: {
               display: false,
            },
         },
         y: {
            grid: {
               borderDash: [2, 2],
            },
            ticks: {
               callback: function (value) {
                  return value / 1000 + "k";
               },
            },
         },
      },
      elements: {
         point: {
            radius: 0,
            hoverRadius: 6,
         },
      },
   };

   const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            display: false,
         },
         tooltip: {
            mode: "index",
            intersect: false,
         },
      },
      scales: {
         x: {
            grid: {
               display: false,
            },
         },
         y: {
            grid: {
               borderDash: [2, 2],
            },
            ticks: {
               callback: function (value) {
                  return value / 1000 + "k";
               },
            },
         },
      },
   };

   const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            position: "right",
            align: "center",
            labels: {
               boxWidth: 8,
               usePointStyle: true,
               pointStyle: "circle",
            },
         },
      },
      cutout: "65%",
   };

   // Sample data for table
   const columns = [
      { header: "Order ID", accessor: "id" },
      { header: "Customer", accessor: "customer" },
      { header: "Date", accessor: "date" },
      { header: "Amount", accessor: "amount" },
      {
         header: "Status",
         accessor: "status",
         render: (row) => {
            const statusColors = {
               completed: "bg-green-100 text-green-800",
               pending: "bg-yellow-100 text-yellow-800",
               cancelled: "bg-red-100 text-red-800",
            };

            return (
               <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status.toLowerCase()]}`}>{row.status}</span>
            );
         },
      },
   ];

   const tableData = [
      { id: "#ORD-001", customer: "John Doe", date: "2023-04-24", amount: "$120.00", status: "Completed" },
      { id: "#ORD-002", customer: "Jane Smith", date: "2023-04-23", amount: "$85.50", status: "Pending" },
      { id: "#ORD-003", customer: "Robert Johnson", date: "2023-04-22", amount: "$210.25", status: "Completed" },
      { id: "#ORD-004", customer: "Emily Davis", date: "2023-04-21", amount: "$45.00", status: "Cancelled" },
      { id: "#ORD-005", customer: "Michael Brown", date: "2023-04-20", amount: "$175.75", status: "Completed" },
   ];

   const usersTabs = [
      { label: "Total Users", active: true },
      { label: "Total Projects", active: false },
      { label: "Operating Status", active: false },
   ];

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
               <p className="text-gray-500">Loading dashboard data...</p>
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
         <h1 className="text-2xl font-bold mb-6">Overview</h1>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
               <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  trendIcon={stat.trendIcon}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
               />
            ))}
         </div>

         {/* Users Chart */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
               <Card title="Total Users" tabs={usersTabs} className="h-full">
                  <div className="h-64">
                     <Chart type="line" data={usersChartData} options={lineChartOptions} />
                  </div>
               </Card>
            </div>

            <div>
               <Card title="Popular Courses" className="h-full">
                  <div className="space-y-4">
                     {popularCoursesData && popularCoursesData.courses ? (
                        popularCoursesData.courses.map((course, index) => (
                           <div key={course.id} className="flex items-center justify-between">
                              <div className="flex-1">
                                 <span className="text-sm font-medium text-gray-700">{course.title}</span>
                                 <div className="text-xs text-gray-500 mt-1">
                                    {course.enrollments} enrollments • {course.completions} completed
                                 </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-primary-500 rounded-full"
                                       style={{
                                          width: `${Math.min((course.enrollments / 250) * 100, 100)}%`,
                                       }}
                                    ></div>
                                 </div>
                                 <span className="text-xs text-gray-500 w-8 text-right">{course.enrollments}</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center text-gray-500 py-4">Loading courses...</div>
                     )}
                  </div>
               </Card>
            </div>
         </div>

         {/* Educational Analytics Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card title="Student Performance Distribution">
               <div className="h-64">
                  <Chart type="bar" data={getPerformanceChartData()} options={barChartOptions} />
               </div>
            </Card>

            <Card title="Course Completion Rates">
               <div className="h-64 flex items-center justify-center">
                  <div className="w-48 h-48">
                     <Chart type="doughnut" data={getCompletionChartData()} options={pieChartOptions} />
                  </div>
                  <div className="ml-4 space-y-2">
                     {courseCompletionData && courseCompletionData.byCourse ? (
                        courseCompletionData.byCourse.slice(0, 5).map((course, index) => (
                           <div key={course.courseId} className="flex items-center justify-between">
                              <div className="flex items-center">
                                 <span
                                    className="inline-block w-2 h-2 rounded-full mr-2"
                                    style={{
                                       backgroundColor: [
                                          "rgba(139, 92, 246, 0.7)",
                                          "rgba(16, 185, 129, 0.7)",
                                          "rgba(59, 130, 246, 0.7)",
                                          "rgba(255, 159, 64, 0.7)",
                                          "rgba(209, 213, 219, 0.7)",
                                       ][index],
                                    }}
                                 ></span>
                                 <span className="text-sm text-gray-700">{course.title}</span>
                              </div>
                              <span className="text-xs text-gray-500 ml-4">{course.completionRate}%</span>
                           </div>
                        ))
                     ) : (
                        <div className="text-center text-gray-500">Loading completion data...</div>
                     )}
                  </div>
               </div>
            </Card>
         </div>

         {/* Recent Activities */}
         <Card title="Recent Activities" className="mb-6">
            {recentActivitiesData && recentActivitiesData.activities.length > 0 ? (
               <div className="space-y-4">
                  {recentActivitiesData.activities.map((activity, index) => (
                     <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <div
                              className={`w-2 h-2 rounded-full ${
                                 activity.type === "enrollment"
                                    ? "bg-green-500"
                                    : activity.type === "assignment_submission"
                                    ? "bg-blue-500"
                                    : activity.type === "login"
                                    ? "bg-gray-500"
                                    : "bg-purple-500"
                              }`}
                           ></div>
                           <div>
                              <p className="text-sm font-medium text-gray-900">{activity.user.name}</p>
                              <p className="text-xs text-gray-500">
                                 {activity.type === "enrollment" && activity.course
                                    ? `Enrolled in ${activity.course.title}`
                                    : activity.type === "assignment_submission" && activity.assignment
                                    ? `Submitted ${activity.assignment.title}`
                                    : activity.type === "login"
                                    ? "Logged in"
                                    : "Activity"}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                           <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                 activity.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : activity.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : activity.status === "graded"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                           >
                              {activity.status}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="h-16 flex items-center justify-center text-gray-400">No recent activities</div>
            )}
         </Card>
      </div>
   );
};

export default Dashboard;
