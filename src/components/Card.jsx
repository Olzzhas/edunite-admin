const Card = ({ title, children, className = '', actions, tabs }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {title && (
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}

      {tabs && (
        <div className="flex border-b border-gray-100">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-3 text-sm font-medium ${
                tab.active
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
