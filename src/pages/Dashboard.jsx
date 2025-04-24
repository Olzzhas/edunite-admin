import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiEye, FiArrowUp, FiArrowRight } from 'react-icons/fi';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import Chart from '../components/Chart';

const Dashboard = () => {
  // Sample data for stats
  const stats = [
    { title: 'Views', value: '7,265', trendIcon: <FiArrowUp size={14} />, trend: 'up', trendValue: '+11.01%' },
    { title: 'Visits', value: '3,671', trendIcon: <FiArrowRight size={14} />, trend: 'down', trendValue: '-0.03%' },
    { title: 'New Users', value: '156', trendIcon: <FiArrowUp size={14} />, trend: 'up', trendValue: '+15.03%' },
    { title: 'Active Users', value: '2,318', trendIcon: <FiArrowUp size={14} />, trend: 'up', trendValue: '+6.08%' },
  ];

  // Sample data for users chart
  const usersChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'This year',
        data: [10000, 15000, 20000, 25000, 30000, 25000, 20000],
        borderColor: 'rgb(79, 70, 229)', // Indigo
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Last year',
        data: [5000, 10000, 15000, 20000, 15000, 10000, 5000],
        borderColor: 'rgb(209, 213, 219)', // Gray
        backgroundColor: 'rgba(209, 213, 219, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  // Sample data for traffic by device
  const deviceChartData = {
    labels: ['Linux', 'Mac', 'iOS', 'Windows', 'Android', 'Other'],
    datasets: [
      {
        data: [15, 25, 20, 30, 15, 20],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)', // Purple
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(0, 0, 0, 0.7)',      // Black
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(209, 213, 219, 0.7)', // Gray
          'rgba(16, 185, 129, 0.7)', // Green
        ],
        borderWidth: 0,
      },
    ],
  };

  // Sample data for traffic by location
  const locationChartData = {
    labels: ['United States', 'Canada', 'Mexico', 'Other'],
    datasets: [
      {
        data: [52.1, 22.8, 13.9, 11.2],
        backgroundColor: [
          'rgba(0, 0, 0, 0.7)',      // Black
          'rgba(209, 213, 219, 0.7)', // Gray
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(139, 92, 246, 0.7)', // Purple
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
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
          callback: function(value) {
            return value / 1000 + 'k';
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
        mode: 'index',
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
          callback: function(value) {
            return value / 1000 + 'k';
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
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    cutout: '65%',
  };

  // Sample data for table
  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: 'amount' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const statusColors = {
          completed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          cancelled: 'bg-red-100 text-red-800',
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status.toLowerCase()]}`}>
            {row.status}
          </span>
        );
      }
    },
  ];

  const tableData = [
    { id: '#ORD-001', customer: 'John Doe', date: '2023-04-24', amount: '$120.00', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', date: '2023-04-23', amount: '$85.50', status: 'Pending' },
    { id: '#ORD-003', customer: 'Robert Johnson', date: '2023-04-22', amount: '$210.25', status: 'Completed' },
    { id: '#ORD-004', customer: 'Emily Davis', date: '2023-04-21', amount: '$45.00', status: 'Cancelled' },
    { id: '#ORD-005', customer: 'Michael Brown', date: '2023-04-20', amount: '$175.75', status: 'Completed' },
  ];

  const usersTabs = [
    { label: 'Total Users', active: true },
    { label: 'Total Projects', active: false },
    { label: 'Operating Status', active: false },
  ];

  const websiteTabs = [
    { label: 'Google', active: true },
    { label: 'YouTube', active: false },
    { label: 'Instagram', active: false },
    { label: 'Pinterest', active: false },
    { label: 'Facebook', active: false },
    { label: 'Twitter', active: false },
  ];

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
          <Card
            title="Total Users"
            tabs={usersTabs}
            className="h-full"
          >
            <div className="h-64">
              <Chart
                type="line"
                data={usersChartData}
                options={lineChartOptions}
              />
            </div>
          </Card>
        </div>

        <div>
          <Card
            title="Traffic by Website"
            className="h-full"
          >
            <div className="space-y-4">
              {websiteTabs.map((tab, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{tab.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: index === 0 ? '70%' : index === 1 ? '60%' : index === 2 ? '50%' : index === 3 ? '40%' : index === 4 ? '30%' : '20%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {index === 0 ? '52.1%' : index === 1 ? '22.8%' : index === 2 ? '13.9%' : index === 3 ? '11.2%' : index === 4 ? '6.5%' : '3.4%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Traffic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Traffic by Device">
          <div className="h-64">
            <Chart
              type="bar"
              data={deviceChartData}
              options={barChartOptions}
            />
          </div>
        </Card>

        <Card title="Traffic by Location">
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Chart
                type="doughnut"
                data={locationChartData}
                options={pieChartOptions}
              />
            </div>
            <div className="ml-4 space-y-2">
              {locationChartData.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: locationChartData.datasets[0].backgroundColor[index] }}></span>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">{locationChartData.datasets[0].data[index]}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Marketing & SEO */}
      <Card title="Marketing & SEO" className="mb-6">
        <div className="h-16 flex items-center justify-center text-gray-400">
          Marketing & SEO data will be displayed here
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
