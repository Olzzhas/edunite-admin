import { FiBell, FiSearch, FiUser, FiMenu, FiBookmark, FiSun } from 'react-icons/fi';

const Header = ({ toggleSidebar, toggleNotifications }) => {
  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 sticky top-0 z-10 border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none text-gray-500"
        >
          <FiMenu size={20} />
        </button>

        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Dashboards</span>
          <span className="text-gray-400 mx-2">/</span>
          <span className="font-medium">Default</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent w-48"
          />
        </div>

        <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none text-gray-500">
          <FiSun size={20} />
        </button>

        <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none text-gray-500">
          <FiBookmark size={20} />
        </button>

        <div className="relative">
          <button
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none text-gray-500"
            onClick={toggleNotifications}
          >
            <FiBell size={20} />
          </button>
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center ml-2">
          <div className="relative">
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <FiUser size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
