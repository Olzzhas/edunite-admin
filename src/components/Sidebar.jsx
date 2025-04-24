import { useLocation, Link } from 'react-router-dom';
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
  FiClipboard
} from 'react-icons/fi';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();

  const categories = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: <FiHome size={18} />, path: '/dashboard' },
        { name: 'Analytics', icon: <FiBarChart2 size={18} />, path: '/analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Users', icon: <FiUsers size={18} />, path: '/users' },
        { name: 'Courses', icon: <FiBook size={18} />, path: '/courses' },
        { name: 'Semesters', icon: <FiCalendar size={18} />, path: '/semesters' },
        { name: 'Threads', icon: <FiLayers size={18} />, path: '/threads' },
        { name: 'Assignments', icon: <FiClipboard size={18} />, path: '/assignments' },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Storage', icon: <FiHardDrive size={18} />, path: '/storage' },
        { name: 'Settings', icon: <FiSettings size={18} />, path: '/settings' },
      ]
    }
  ];

  return (
    <div className={`bg-white text-gray-700 h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 fixed left-0 top-0 z-10 border-r border-gray-200`}>
      <div className="flex justify-between items-center p-5">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-lg">Edunite</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none text-gray-500"
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)] px-4">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            {!collapsed && (
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2 px-2">{category.title}</h3>
            )}
            <nav>
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path ||
                                  (item.path !== '/' && location.pathname.startsWith(item.path));

                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center py-2 px-3 rounded-lg ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-gray-100 text-gray-700'
                        } transition-colors`}
                      >
                        <span className={`text-${isActive ? 'primary-600' : 'gray-500'} ${collapsed ? '' : 'mr-3'}`}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className={`${isActive ? 'font-medium' : ''}`}>{item.name}</span>}
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
