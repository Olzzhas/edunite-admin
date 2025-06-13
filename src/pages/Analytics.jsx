import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Chart from "../components/Chart";
import { analyticsService } from "../services/api";

const Analytics = () => {
   const [loading, setLoading] = useState(true);
   const [detailedStats, setDetailedStats] = useState(null);
   const [performanceMetrics, setPerformanceMetrics] = useState(null);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchAnalyticsData = async () => {
         try {
            setLoading(true);
            setError(null);

            const [detailed, performance] = await Promise.all([
               analyticsService.getDetailedStats(),
               analyticsService.getPerformanceMetrics(),
            ]);

            setDetailedStats(detailed);
            setPerformanceMetrics(performance);
         } catch (err) {
            console.error("Error fetching analytics data:", err);
            setError("Failed to load analytics data");
         } finally {
            setLoading(false);
         }
      };

      fetchAnalyticsData();
   }, []);

   // Transform course enrollments data for chart
   const getCourseEnrollmentsData = () => {
      if (!detailedStats) {
         return {
            labels: [],
            datasets: [],
         };
      }

      const currentLabels = detailedStats.courseEnrollments.timeline.map((item) =>
         new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
      const enrollmentsData = detailedStats.courseEnrollments.timeline.map((item) => item.enrollments);
      const completionsData = detailedStats.courseEnrollments.timeline.map((item) => item.completions);

      return {
         labels: currentLabels,
         datasets: [
            {
               label: "Course Enrollments",
               data: enrollmentsData,
               borderColor: "rgb(75, 192, 192)",
               backgroundColor: "rgba(75, 192, 192, 0.2)",
               tension: 0.4,
            },
            {
               label: "Course Completions",
               data: completionsData,
               borderColor: "rgb(153, 102, 255)",
               backgroundColor: "rgba(153, 102, 255, 0.2)",
               tension: 0.4,
            },
         ],
      };
   };

   const revenueData = getCourseEnrollmentsData();

   // Transform user activity data for chart
   const getUserActivityData = () => {
      if (!detailedStats) {
         return {
            labels: [],
            datasets: [],
         };
      }

      return {
         labels: detailedStats.userActivity.daily.map((item) => item.day),
         datasets: [
            {
               label: "Active Users",
               data: detailedStats.userActivity.daily.map((item) => item.activeUsers),
               backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
         ],
      };
   };

   // Transform traffic source data for chart
   const getTrafficSourceData = () => {
      if (!detailedStats) {
         return {
            labels: [],
            datasets: [],
         };
      }

      return {
         labels: detailedStats.trafficSources.map((source) => source.source),
         datasets: [
            {
               data: detailedStats.trafficSources.map((source) => source.value),
               backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
               ],
            },
         ],
      };
   };

   const userActivityData = getUserActivityData();
   const trafficSourceData = getTrafficSourceData();

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
               <p className="text-gray-500">Loading analytics data...</p>
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
         <h1 className="text-2xl font-bold mb-6">Analytics</h1>

         {/* Course Enrollments Chart */}
         <Card title="Course Enrollments & Completions" className="mb-6">
            <Chart
               type="line"
               data={revenueData}
               options={{
                  responsive: true,
                  plugins: {
                     legend: {
                        position: "top",
                     },
                     title: {
                        display: false,
                     },
                  },
               }}
            />
         </Card>

         {/* User Activity and Traffic Source */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="User Activity">
               <Chart
                  type="bar"
                  data={userActivityData}
                  options={{
                     responsive: true,
                     plugins: {
                        legend: {
                           position: "top",
                        },
                        title: {
                           display: false,
                        },
                     },
                  }}
               />
            </Card>

            <Card title="Traffic Sources">
               <Chart
                  type="doughnut"
                  data={trafficSourceData}
                  options={{
                     responsive: true,
                     plugins: {
                        legend: {
                           position: "right",
                        },
                        title: {
                           display: false,
                        },
                     },
                  }}
               />
            </Card>
         </div>

         {/* Key Metrics */}
         <Card title="Key Performance Metrics">
            {performanceMetrics ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(performanceMetrics.metrics).map(([key, metric]) => (
                     <div key={key} className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">{metric.description}</p>
                        <p className="text-2xl font-bold">
                           {metric.value}
                           {metric.unit && metric.unit !== "time" && metric.unit !== "points" && metric.unit}
                        </p>
                        <p
                           className={`text-xs ${
                              metric.trend === "up"
                                 ? "text-green-500"
                                 : metric.trend === "down"
                                 ? "text-red-500"
                                 : "text-gray-500"
                           }`}
                        >
                           {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"} {metric.change} from last month
                        </p>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="h-32 flex items-center justify-center text-gray-400">Loading performance metrics...</div>
            )}
         </Card>
      </div>
   );
};

export default Analytics;
