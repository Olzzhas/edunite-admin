import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NotificationsPanel from "../components/NotificationsPanel";

const DashboardLayout = () => {
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);

   const toggleSidebar = () => {
      setSidebarCollapsed(!sidebarCollapsed);
   };

   const toggleNotifications = () => {
      setShowNotifications(!showNotifications);
   };

   return (
      <div className="flex h-screen bg-secondary font-sf">
         <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

         <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
            <Header toggleSidebar={toggleSidebar} toggleNotifications={toggleNotifications} />

            <div className="flex">
               <main className="flex-1 p-6 overflow-auto" style={{ height: "calc(100vh - 64px)" }}>
                  <Outlet />
               </main>

               {showNotifications && (
                  <aside className="w-80 border-l h-[calc(100vh-64px)] card overflow-auto">
                     <NotificationsPanel />
                  </aside>
               )}
            </div>
         </div>
      </div>
   );
};

export default DashboardLayout;
