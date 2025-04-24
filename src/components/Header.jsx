import { FiBell, FiSearch, FiUser, FiMenu, FiBookmark, FiSun, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState, useRef, useEffect } from 'react';

const Header = ({ toggleSidebar, toggleNotifications }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

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

        <div className="flex items-center ml-2 relative" ref={userMenuRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <FiUser size={16} />
            </div>
            {user && (
              <span className="ml-2 text-sm font-medium hidden md:block">
                {user.name}
              </span>
            )}
          </button>

          {/* User dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mock Auth Enabled
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-2 h-4 w-4 text-gray-500" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
