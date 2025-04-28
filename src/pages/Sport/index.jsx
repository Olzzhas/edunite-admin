import { useState } from 'react';
import { FiActivity, FiUsers, FiMapPin, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const Sport = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const sportModules = [
    {
      title: 'Sport Types',
      description: 'Manage different types of sports and activities',
      icon: <FiActivity size={24} className="text-blue-500" />,
      path: '/sport/types',
      count: 5,
    },
    {
      title: 'Facilities',
      description: 'Manage sports facilities and locations',
      icon: <FiMapPin size={24} className="text-green-500" />,
      path: '/sport/facilities',
      count: 4,
    },
    {
      title: 'Physical Education',
      description: 'Manage PE sessions and bookings',
      icon: <FiUsers size={24} className="text-purple-500" />,
      path: '/sport/physical-education',
      count: 12,
    },
    {
      title: 'Schedules',
      description: 'Create and manage sports schedules',
      icon: <FiCalendar size={24} className="text-orange-500" />,
      path: '/sport/schedules',
      count: 8,
    },
    {
      title: 'Filtered Schedules',
      description: 'Search and filter sports schedules',
      icon: <FiCalendar size={24} className="text-pink-500" />,
      path: '/sport/filtered-schedules',
      count: 15,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sport Service</h1>
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sportModules.map((module, index) => (
              <Link key={index} to={module.path} className="block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="p-3 rounded-lg bg-gray-100">{module.icon}</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      <div className="mt-2 text-sm text-primary-600">
                        {module.count} {module.title.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Activities">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiActivity className="text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">New Basketball session added</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiMapPin className="text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Tennis Court maintenance scheduled</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FiUsers className="text-purple-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">15 new bookings for Swimming</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Upcoming Events">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <FiCalendar className="text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Basketball Tournament</p>
                      <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <FiCalendar className="text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Swimming Competition</p>
                      <p className="text-xs text-gray-500">Next Monday, 10:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <FiCalendar className="text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Football Match</p>
                      <p className="text-xs text-gray-500">Next Friday, 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'statistics' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Sport Service Statistics</h2>
          <p className="text-gray-600">
            Detailed statistics about sport activities, facilities usage, and bookings will be displayed here.
          </p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Sport Service Settings</h2>
          <p className="text-gray-600">
            Configure settings for the sport service, including notification preferences, booking rules, and more.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sport;
