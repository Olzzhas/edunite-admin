import React from 'react';
import { getLogLevelColor, getServiceColor, formatLogDate, normalizeLogLevel, formatServiceName } from '../../utils/logUtils';

const LogEntry = ({ log, onClick, isSelected }) => {
  if (!log) return null;

  const handleClick = () => {
    onClick(log);
  };

  // Truncate message if it's too long
  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return 'No message';
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <div
      className={`p-4 hover:bg-secondary-hover cursor-pointer transition-colors ${
        isSelected ? 'bg-secondary-hover border-l-4 border-primary-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-2">
        {/* Header with timestamp and level */}
        <div className="flex justify-between items-start">
          <div className="text-sm text-tertiary">
            {formatLogDate(log.datetime || log.timestamp)}
          </div>
          <div className="flex space-x-2">
            {/* Service Badge */}
            {log.service && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getServiceColor(log.service)}`}
              >
                {formatServiceName(log.service)}
              </span>
            )}
            
            {/* Level Badge */}
            {log.level && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getLogLevelColor(log.level)}`}
              >
                {normalizeLogLevel(log.level)}
              </span>
            )}
          </div>
        </div>
        
        {/* Message */}
        <div className="text-sm">
          {truncateMessage(log.message)}
        </div>
        
        {/* Additional metadata if available */}
        {log.context && (
          <div className="text-xs text-tertiary">
            Context: {typeof log.context === 'object' 
              ? JSON.stringify(log.context).substring(0, 50) + '...' 
              : log.context}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogEntry;
