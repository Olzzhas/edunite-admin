import { useState, useEffect } from "react";
import {
   FiRefreshCw,
   FiCheckCircle,
   FiXCircle,
   FiAlertTriangle,
   FiClock,
   FiServer,
   FiDatabase,
   FiUsers,
   FiLock,
   FiHardDrive,
   FiActivity,
   FiAward,
} from "react-icons/fi";

const HealthCheck = () => {
   // Mock service data
   const [services, setServices] = useState([
      {
         id: "course",
         name: "Course Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/course",
         icon: <FiServer className="h-6 w-6" />,
         description: "Manages course data and operations",
      },
      {
         id: "user",
         name: "User Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/user",
         icon: <FiUsers className="h-6 w-6" />,
         description: "Handles user profiles and management",
      },
      {
         id: "auth",
         name: "Auth Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/auth",
         icon: <FiLock className="h-6 w-6" />,
         description: "Authentication and authorization",
      },
      {
         id: "storage",
         name: "Storage Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/storage",
         icon: <FiHardDrive className="h-6 w-6" />,
         description: "File storage and management",
      },
      {
         id: "logger",
         name: "Logger Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/logger",
         icon: <FiActivity className="h-6 w-6" />,
         description: "System logging and monitoring",
      },
      {
         id: "sport",
         name: "Sport Service",
         status: "loading",
         uptime: null,
         lastChecked: null,
         responseTime: null,
         endpoint: "/api/health/sport",
         icon: <FiAward className="h-6 w-6" />,
         description: "Sports activities and events",
      },
   ]);

   const [isRefreshing, setIsRefreshing] = useState(false);
   const [lastRefreshed, setLastRefreshed] = useState(new Date());
   const [overallStatus, setOverallStatus] = useState("loading");

   // Mock health check function
   const checkServicesHealth = () => {
      setIsRefreshing(true);

      // Update services with always healthy status
      const updatedServices = services.map((service) => {
         // Always return healthy status
         const status = "healthy";

         // Generate random response time between 50-500ms
         const responseTime = Math.floor(Math.random() * 450) + 50;

         // Generate random uptime between 1-30 days
         const uptimeDays = Math.floor(Math.random() * 29) + 1;
         const uptime = `${uptimeDays}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`;

         return {
            ...service,
            status,
            responseTime,
            uptime,
            lastChecked: new Date(),
         };
      });

      setServices(updatedServices);
      setLastRefreshed(new Date());

      // Set overall status to healthy
      setOverallStatus("healthy");

      setTimeout(() => {
         setIsRefreshing(false);
      }, 1000);
   };

   // Initial health check on component mount
   useEffect(() => {
      checkServicesHealth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Format the timestamp
   const formatTime = (date) => {
      if (!date) return "Never";
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
   };

   // Get status badge
   const getStatusBadge = (status) => {
      switch (status) {
         case "healthy":
            return (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FiCheckCircle className="mr-1" /> Operational
               </span>
            );
         case "degraded":
            return (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <FiAlertTriangle className="mr-1" /> Degraded
               </span>
            );
         case "down":
            return (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FiXCircle className="mr-1" /> Down
               </span>
            );
         default:
            return (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FiClock className="mr-1" /> Checking...
               </span>
            );
      }
   };

   // Get status color
   const getStatusColor = (status) => {
      switch (status) {
         case "healthy":
            return "bg-green-500";
         case "degraded":
            return "bg-yellow-500";
         case "down":
            return "bg-red-500";
         default:
            return "bg-gray-300";
      }
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium">Service Health</h1>
            <button
               onClick={checkServicesHealth}
               disabled={isRefreshing}
               className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 flex items-center text-sm disabled:opacity-50"
            >
               <FiRefreshCw className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
               <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
         </div>

         {/* Overall Status */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-lg font-medium text-gray-900">System Status</h2>
                  <p className="text-sm text-gray-500">Last checked: {formatTime(lastRefreshed)}</p>
               </div>
               <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${getStatusColor(overallStatus)}`}></div>
                  <span className="font-medium">
                     {overallStatus === "healthy"
                        ? "All Systems Operational"
                        : overallStatus === "degraded"
                        ? "Partial System Outage"
                        : overallStatus === "down"
                        ? "Major System Outage"
                        : "Checking Status..."}
                  </span>
               </div>
            </div>
         </div>

         {/* Service Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
               <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                           <div className="bg-primary-100 p-2 rounded-lg mr-3 text-primary-600">{service.icon}</div>
                           <h3 className="text-base font-medium text-gray-900">{service.name}</h3>
                        </div>
                        {getStatusBadge(service.status)}
                     </div>
                     <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                  <div className="px-4 py-3 bg-gray-50">
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                           <p className="text-gray-500">Response Time</p>
                           <p className="font-medium">{service.responseTime ? `${service.responseTime}ms` : "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-gray-500">Uptime</p>
                           <p className="font-medium">{service.uptime || "N/A"}</p>
                        </div>
                     </div>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                     Endpoint: {service.endpoint}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default HealthCheck;
