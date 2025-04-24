import Card from '../components/Card';
import Chart from '../components/Chart';

const Analytics = () => {
  // Sample data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue 2023',
        data: [12000, 19000, 15000, 22000, 18000, 24000, 25000, 28000, 30000, 25000, 32000, 35000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Revenue 2022',
        data: [10000, 15000, 12000, 18000, 15000, 20000, 22000, 24000, 25000, 22000, 28000, 30000],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [420, 380, 450, 520, 490, 380, 320],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const trafficSourceData = {
    labels: ['Direct', 'Organic Search', 'Referral', 'Social Media', 'Email', 'Other'],
    datasets: [
      {
        data: [35, 25, 15, 15, 8, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      
      {/* Revenue Chart */}
      <Card title="Revenue Trends" className="mb-6">
        <Chart 
          type="line" 
          data={revenueData} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
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
                  position: 'top',
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
                  position: 'right',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <p className="text-2xl font-bold">3.2%</p>
            <p className="text-xs text-green-500">↑ 0.5% from last month</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Avg. Order Value</p>
            <p className="text-2xl font-bold">$85.20</p>
            <p className="text-xs text-green-500">↑ $3.50 from last month</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Bounce Rate</p>
            <p className="text-2xl font-bold">42.8%</p>
            <p className="text-xs text-red-500">↑ 2.1% from last month</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Avg. Session Duration</p>
            <p className="text-2xl font-bold">2m 45s</p>
            <p className="text-xs text-green-500">↑ 15s from last month</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
