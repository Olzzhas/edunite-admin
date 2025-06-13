import React, { useState } from 'react';
import { FiEye, FiCode, FiType, FiX } from 'react-icons/fi';
import { previewTemplate, getDefaultTestData, formatTemplateInfo } from '../utils/templateUtils';

const EmailTemplatePreview = ({ template, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [testData, setTestData] = useState(() => getDefaultTestData(template));

  if (!template) {
    return null;
  }

  const templateInfo = formatTemplateInfo(template);
  const preview = previewTemplate(template, testData);

  const handleTestDataChange = (key, value) => {
    setTestData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{templateInfo.name}</h2>
            <p className="text-sm text-gray-500">{templateInfo.subject}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiEye className="inline mr-2" size={16} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'html'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiCode className="inline mr-2" size={16} />
            HTML
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'text'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiType className="inline mr-2" size={16} />
            Text
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Variables Panel */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h3 className="font-medium mb-3">Template Variables</h3>
            
            {templateInfo.variableCount === 0 ? (
              <p className="text-gray-500 text-sm">No variables defined</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(template.variables || {}).map(([key, description]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={testData[key] || ''}
                      onChange={(e) => handleTestDataChange(key, e.target.value)}
                      placeholder={description}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Template Info */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Template Info</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Variables: {templateInfo.variableCount}</div>
                <div>HTML: {templateInfo.hasHtml ? '✓' : '✗'}</div>
                <div>Text: {templateInfo.hasText ? '✓' : '✗'}</div>
                <div>Active: {template.is_active ? '✓' : '✗'}</div>
              </div>
            </div>

            {/* Errors and Warnings */}
            {(preview.errors.length > 0 || preview.warnings.length > 0) && (
              <div className="mt-4 pt-4 border-t">
                {preview.errors.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-medium text-sm text-red-600 mb-1">Errors</h4>
                    {preview.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-600">{error}</p>
                    ))}
                  </div>
                )}
                
                {preview.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-yellow-600 mb-1">Warnings</h4>
                    {preview.warnings.map((warning, index) => (
                      <p key={index} className="text-xs text-yellow-600">{warning}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Panel */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'preview' && (
              <div>
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Subject</h4>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {preview.subject || 'No subject'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">HTML Preview</h4>
                  <div className="border rounded">
                    {preview.htmlContent ? (
                      <iframe
                        srcDoc={preview.htmlContent}
                        className="w-full h-96 border-0"
                        title="Email Preview"
                      />
                    ) : (
                      <div className="p-4 text-gray-500 text-center">
                        No HTML content
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'html' && (
              <div>
                <h4 className="font-medium text-sm mb-2">HTML Source</h4>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto h-full">
                  <code>{preview.htmlContent || 'No HTML content'}</code>
                </pre>
              </div>
            )}

            {activeTab === 'text' && (
              <div>
                <h4 className="font-medium text-sm mb-2">Text Content</h4>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap h-full overflow-auto">
                  {preview.textContent || 'No text content'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;
