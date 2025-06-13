import { useState, useEffect } from "react";
import { FiSend, FiMail, FiAlertCircle, FiCheckCircle, FiInfo, FiEye } from "react-icons/fi";
import { notificationService } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { processEmailTemplates } from "../utils/templateUtils";
import EmailTemplatePreview from "../components/EmailTemplatePreview";

const NotificationTest = () => {
   const { addToast } = useToast();
   const [emailTemplates, setEmailTemplates] = useState([]);
   const [testResults, setTestResults] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [previewTemplate, setPreviewTemplate] = useState(null);

   const [testData, setTestData] = useState({
      title: "Test Notification",
      message: "This is a test notification to verify email template functionality.",
      type: "info",
      priority: "normal",
      target_type: "all",
      send_email: true,
      email_subject: "Test Email Subject",
      email_template: "default_notification",
   });

   // Load email templates on component mount
   useEffect(() => {
      loadEmailTemplates();
   }, []);

   const loadEmailTemplates = async () => {
      try {
         console.log("Loading email templates for testing...");
         const response = await notificationService.getEmailTemplates();
         console.log("Templates response:", response);

         const templates = response?.templates || [];

         // Process templates using utility function
         const processedTemplates = processEmailTemplates(templates);

         setEmailTemplates(processedTemplates);

         if (processedTemplates.length > 0) {
            setTestData((prev) => ({ ...prev, email_template: processedTemplates[0].name }));
         }

         addTestResult("success", "Email templates loaded", `Found ${processedTemplates.length} templates`);
      } catch (error) {
         console.error("Error loading templates:", error);
         addTestResult("error", "Failed to load email templates", error.message);
      }
   };

   const addTestResult = (type, title, details) => {
      const result = {
         id: Date.now(),
         type,
         title,
         details,
         timestamp: new Date().toLocaleTimeString(),
      };
      setTestResults((prev) => [result, ...prev]);
   };

   const testEmailTemplate = async (templateName) => {
      setIsLoading(true);
      try {
         const testNotification = {
            ...testData,
            email_template: templateName,
            title: `Test: ${templateName}`,
            email_subject: `Test Email: ${templateName}`,
         };

         console.log("Testing notification with template:", templateName);
         console.log("Notification data:", testNotification);

         const result = await notificationService.createNotification(testNotification);
         console.log("Test result:", result);

         addTestResult("success", `Template "${templateName}" test successful`, JSON.stringify(result, null, 2));
         addToast(`Test notification sent with template: ${templateName}`, "success");
      } catch (error) {
         console.error("Test failed:", error);
         addTestResult("error", `Template "${templateName}" test failed`, error.response?.data?.message || error.message);
         addToast(`Test failed for template: ${templateName}`, "error");
      } finally {
         setIsLoading(false);
      }
   };

   const testAllTemplates = async () => {
      if (emailTemplates.length === 0) {
         addToast("No templates available to test", "warning");
         return;
      }

      setIsLoading(true);
      addTestResult("info", "Starting batch test", `Testing ${emailTemplates.length} templates`);

      for (const template of emailTemplates) {
         try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between tests
            await testEmailTemplate(template.name);
         } catch (error) {
            console.error(`Batch test failed for ${template.name}:`, error);
         }
      }

      setIsLoading(false);
      addTestResult("info", "Batch test completed", "All templates tested");
   };

   const clearResults = () => {
      setTestResults([]);
   };

   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setTestData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   return (
      <>
         <div className="p-4">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center">
                  <FiMail className="text-primary-600 mr-3" size={24} />
                  <h1 className="text-xl font-medium">Notification API Test</h1>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Test Configuration */}
               <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-medium mb-4">Test Configuration</h2>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                           type="text"
                           name="title"
                           value={testData.title}
                           onChange={handleInputChange}
                           className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                           name="message"
                           value={testData.message}
                           onChange={handleInputChange}
                           rows="3"
                           className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                        <input
                           type="text"
                           name="email_subject"
                           value={testData.email_subject}
                           onChange={handleInputChange}
                           className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                     </div>

                     <div className="flex items-center">
                        <input
                           type="checkbox"
                           name="send_email"
                           checked={testData.send_email}
                           onChange={handleInputChange}
                           className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Send Email</label>
                     </div>
                  </div>

                  <div className="mt-6 space-y-3">
                     <button
                        onClick={loadEmailTemplates}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                     >
                        <FiMail className="mr-2" size={16} />
                        Reload Templates
                     </button>

                     <button
                        onClick={testAllTemplates}
                        disabled={isLoading || emailTemplates.length === 0}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                     >
                        <FiSend className="mr-2" size={16} />
                        {isLoading ? "Testing..." : "Test All Templates"}
                     </button>

                     <button
                        onClick={clearResults}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                     >
                        Clear Results
                     </button>
                  </div>
               </div>

               {/* Email Templates */}
               <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-medium mb-4">Available Templates ({emailTemplates.length})</h2>

                  {emailTemplates.length === 0 ? (
                     <p className="text-gray-500 text-center py-4">No templates loaded</p>
                  ) : (
                     <div className="space-y-2">
                        {emailTemplates.map((template) => (
                           <div key={template.name} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <h3 className="font-medium text-sm">{template.name}</h3>
                                    <p className="text-xs text-gray-500">{template.subject}</p>
                                    {template.variables && (
                                       <p className="text-xs text-gray-400 mt-1">
                                          Variables: {Object.keys(template.variables).join(", ")}
                                       </p>
                                    )}
                                 </div>
                                 <div className="flex space-x-2">
                                    <button
                                       onClick={() => setPreviewTemplate(template)}
                                       className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100"
                                    >
                                       <FiEye className="inline mr-1" size={12} />
                                       Preview
                                    </button>
                                    <button
                                       onClick={() => testEmailTemplate(template.name)}
                                       disabled={isLoading}
                                       className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 disabled:opacity-50"
                                    >
                                       Test
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Test Results */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
               <h2 className="text-lg font-medium mb-4">Test Results ({testResults.length})</h2>

               {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No test results yet</p>
               ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                     {testResults.map((result) => (
                        <div
                           key={result.id}
                           className={`border rounded-lg p-3 ${
                              result.type === "success"
                                 ? "border-green-200 bg-green-50"
                                 : result.type === "error"
                                 ? "border-red-200 bg-red-50"
                                 : "border-blue-200 bg-blue-50"
                           }`}
                        >
                           <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3 mt-0.5">
                                 {result.type === "success" && <FiCheckCircle className="text-green-600" size={16} />}
                                 {result.type === "error" && <FiAlertCircle className="text-red-600" size={16} />}
                                 {result.type === "info" && <FiInfo className="text-blue-600" size={16} />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">{result.title}</h3>
                                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                                 </div>
                                 <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{result.details}</pre>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Email Template Preview Modal */}
         {previewTemplate && <EmailTemplatePreview template={previewTemplate} onClose={() => setPreviewTemplate(null)} />}
      </>
   );
};

export default NotificationTest;
