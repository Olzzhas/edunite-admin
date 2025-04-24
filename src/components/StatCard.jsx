const StatCard = ({ title, value, icon, trend, trendValue, className = '', trendIcon }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendArrow = trend === 'up' ? '↑' : '↓';

  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500 text-sm">{title}</p>
          {trendIcon && (
            <div className="text-gray-400">
              {trendIcon}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>

          {trend && (
            <div className="flex items-center">
              <span className={`flex items-center text-xs ${trendColor} font-medium`}>
                <span className="mr-1">{trendArrow}</span>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
