import { useLocation, Link } from "react-router-dom";
import {
   FiHome,
   FiUsers,
   FiBook,
   FiSettings,
   FiBarChart2,
   FiCalendar,
   FiMenu,
   FiX,
   FiFileText,
   FiUser,
   FiLayers,
   FiHardDrive,
   FiClipboard,
   FiDatabase,
   FiAlertCircle,
   FiActivity,
   FiMapPin,
   FiServer,
} from "react-icons/fi";

const Sidebar = ({ collapsed, toggleSidebar }) => {
   const location = useLocation();

   const categories = [
      {
         title: "Main",
         items: [
            { name: "Dashboard", icon: <FiHome size={18} />, path: "/dashboard" },
            { name: "Analytics", icon: <FiBarChart2 size={18} />, path: "/analytics" },
         ],
      },
      {
         title: "Management",
         items: [
            { name: "Users", icon: <FiUsers size={18} />, path: "/users" },
            { name: "Courses", icon: <FiBook size={18} />, path: "/courses" },
            { name: "Semesters", icon: <FiCalendar size={18} />, path: "/semesters" },
            { name: "Threads", icon: <FiLayers size={18} />, path: "/threads" },
            { name: "Assignments", icon: <FiClipboard size={18} />, path: "/assignments" },
            { name: "Locations", icon: <FiMapPin size={18} />, path: "/locations" },
         ],
      },
      {
         title: "Sport Service",
         items: [
            { name: "Sport Overview", icon: <FiActivity size={18} />, path: "/sport" },
            { name: "Sport Types", icon: <FiActivity size={18} />, path: "/sport/types" },
            { name: "Facilities", icon: <FiMapPin size={18} />, path: "/sport/facilities" },
            { name: "Physical Education", icon: <FiUsers size={18} />, path: "/sport/physical-education" },
            { name: "Schedules", icon: <FiCalendar size={18} />, path: "/sport/schedules" },
            { name: "Filtered Schedules", icon: <FiCalendar size={18} />, path: "/sport/filtered-schedules" },
         ],
      },
      {
         title: "System",
         items: [
            { name: "Health Check", icon: <FiServer size={18} />, path: "/health-check" },
            { name: "Storage", icon: <FiHardDrive size={18} />, path: "/storage" },
            { name: "Logs", icon: <FiDatabase size={18} />, path: "/logs" },
            { name: "Settings", icon: <FiSettings size={18} />, path: "/settings" },
         ],
      },
   ];

   return (
      <div
         className={`sidebar h-screen ${
            collapsed ? "w-20" : "w-64"
         } transition-all duration-300 fixed left-0 top-0 z-10 border-r`}
      >
         <div className="flex justify-between items-center p-5">
            {!collapsed && (
               <div className="flex items-center">
                  <span className="font-bold text-lg">EDUNITE</span>
               </div>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-tertiary focus:outline-none">
               {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
         </div>

         <div className="overflow-y-auto h-[calc(100vh-80px)] px-4">
            {categories.map((category, categoryIndex) => (
               <div key={categoryIndex} className="mb-6">
                  {!collapsed && <h3 className="text-xs uppercase text-tertiary font-medium mb-2 px-2">{category.title}</h3>}
                  <nav>
                     <ul className="space-y-1">
                        {category.items.map((item, itemIndex) => {
                           // For the sport overview, only mark as active if it's an exact match
                           const isSportOverview = item.path === "/sport";

                           // For other items, use the standard logic
                           const isActive =
                              location.pathname === item.path ||
                              (item.path !== "/" &&
                                 location.pathname.startsWith(item.path) &&
                                 // Don't mark sport overview as active when on a sport sub-page
                                 !(isSportOverview && location.pathname !== "/sport"));

                           return (
                              <li key={itemIndex}>
                                 <Link
                                    to={item.path}
                                    className={`flex items-center py-2 px-3 rounded-lg ${
                                       isActive ? "bg-primary-100 text-primary-600" : "hover:bg-tertiary"
                                    } transition-colors`}
                                 >
                                    <span
                                       className={`${isActive ? "text-primary-600" : "text-tertiary"} ${collapsed ? "" : "mr-3"}`}
                                    >
                                       {item.icon}
                                    </span>
                                    {!collapsed && <span className={`${isActive ? "font-medium" : ""}`}>{item.name}</span>}
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  </nav>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Sidebar;
