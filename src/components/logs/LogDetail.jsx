import React from 'react';
import { FiX, FiClock, FiTag, FiServer, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { getLogLevelColor, formatLogDate, formatJsonData, normalizeLogLevel, formatServiceName } from '../../utils/logUtils';

const LogDetail = ({ log, onClose }) => {
  if (!log) return null;

  // Format data for display
  const formatData = (data) => {
    if (!data) return null;
    
    if (typeof data === 'object') {
      return (
        <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-xs mt-2">
          {formatJsonData(data)}
        </pre>
      );
    }
    
    return <span>{String(data)}</span>;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Log Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary-hover"
          aria-label="Close details"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Level */}
        <div className="flex items-center">
          <div className="w-8">
            <FiAlertCircle className="text-tertiary" />
          </div>
          <div>
            <div className="text-sm text-tertiary">Level</div>
            <div>
              <span className={`px-2 py-0.5 text-sm rounded-full ${getLogLevelColor(log.level)}`}>
                {normalizeLogLevel(log.level)}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center">
          <div className="w-8">
            <FiClock className="text-tertiary" />
          </div>
          <div>
            <div className="text-sm text-tertiary">Timestamp</div>
            <div>{formatLogDate(log.datetime || log.timestamp)}</div>
          </div>
        </div>

        {/* Service */}
        {log.service && (
          <div className="flex items-center">
            <div className="w-8">
              <FiServer className="text-tertiary" />
            </div>
            <div>
              <div className="text-sm text-tertiary">Service</div>
              <div>{formatServiceName(log.service)}</div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="flex items-start">
          <div className="w-8 pt-1">
            <FiFileText className="text-tertiary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-tertiary">Message</div>
            <div className="p-2 bg-secondary rounded-md">
              {log.message || 'No message'}
            </div>
          </div>
        </div>

        {/* Context/Data */}
        {(log.context || log.data) && (
          <div className="flex items-start">
            <div className="w-8 pt-1">
              <FiTag className="text-tertiary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-tertiary">Context/Data</div>
              {formatData(log.context || log.data)}
            </div>
          </div>
        )}

        {/* Stack Trace (if available) */}
        {log.stack && (
          <div className="flex items-start">
            <div className="w-8 pt-1">
              <FiFileText className="text-tertiary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-tertiary">Stack Trace</div>
              <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-xs mt-2 whitespace-pre-wrap">
                {log.stack}
              </pre>
            </div>
          </div>
        )}

        {/* Additional Properties */}
        {log.id && (
          <div className="text-xs text-tertiary mt-4">
            Log ID: {log.id}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDetail;
