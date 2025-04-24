import { FiBell, FiClock, FiUser, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      title: 'You fixed a bug.',
      time: 'Just now',
      icon: <FiCheck />,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 2,
      title: 'New user registered.',
      time: '2 hours ago',
      icon: <FiUser />,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      title: 'You fixed a bug.',
      time: '12 hours ago',
      icon: <FiCheck />,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 4,
      title: 'Andi Lane subscribed to you.',
      time: 'Today, 11:59 AM',
      icon: <FiUser />,
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  const activities = [
    {
      id: 1,
      title: 'Changed the style.',
      time: 'Just now',
      user: {
        name: 'Jane Doe',
        avatar: 'J',
        color: 'bg-pink-100 text-pink-600',
      },
    },
    {
      id: 2,
      title: 'Released a new version.',
      time: '59 minutes ago',
      user: {
        name: 'Bob Smith',
        avatar: 'B',
        color: 'bg-yellow-100 text-yellow-600',
      },
    },
    {
      id: 3,
      title: 'Submitted a bug.',
      time: '12 hours ago',
      user: {
        name: 'Alex Johnson',
        avatar: 'A',
        color: 'bg-green-100 text-green-600',
      },
    },
    {
      id: 4,
      title: 'Modified A data in Page X.',
      time: 'Today, 11:59 AM',
      user: {
        name: 'Kate Wilson',
        avatar: 'K',
        color: 'bg-indigo-100 text-indigo-600',
      },
    },
    {
      id: 5,
      title: 'Deleted a page in Project X.',
      time: 'Feb 2, 2023',
      user: {
        name: 'Michael Brown',
        avatar: 'M',
        color: 'bg-blue-100 text-blue-600',
      },
    },
  ];

  const contacts = [
    {
      id: 1,
      name: 'Natali Craig',
      avatar: 'N',
      color: 'bg-gray-100 text-gray-600',
    },
    {
      id: 2,
      name: 'Drew Cano',
      avatar: 'D',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      name: 'Andi Lane',
      avatar: 'A',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 4,
      name: 'Koray Okumus',
      avatar: 'K',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 5,
      name: 'Kate Morrison',
      avatar: 'K',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 6,
      name: 'Melody Macy',
      avatar: 'M',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <div className="h-full notification-panel">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Today</h3>
          <span className="text-xs text-tertiary">
            <FiClock className="inline mr-1" size={12} />
          </span>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${notification.iconBg}`}>
                {notification.icon}
              </div>
              <div>
                <p className="text-sm">{notification.title}</p>
                <p className="text-xs text-tertiary">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-4">Activities</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.user.color}`}>
                {activity.user.avatar}
              </div>
              <div>
                <p className="text-sm">{activity.title}</p>
                <p className="text-xs text-tertiary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium mb-4">Contacts</h3>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${contact.color}`}>
                {contact.avatar}
              </div>
              <p className="text-sm">{contact.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
