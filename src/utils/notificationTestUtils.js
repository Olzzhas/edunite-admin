/**
 * Utility functions for testing notification API
 */

import { notificationService } from '../services/api';

/**
 * Test email template functionality
 * @param {string} templateName - Name of the template to test
 * @param {Object} testData - Test notification data
 * @returns {Promise<Object>} Test result
 */
export const testEmailTemplate = async (templateName, testData = {}) => {
  const defaultTestData = {
    title: `Test: ${templateName}`,
    message: `This is a test notification for template: ${templateName}`,
    type: 'info',
    priority: 'normal',
    target_type: 'all',
    send_email: true,
    email_subject: `Test Email: ${templateName}`,
    email_template: templateName,
  };

  const notificationData = { ...defaultTestData, ...testData };

  try {
    console.log(`Testing template: ${templateName}`);
    console.log('Notification data:', notificationData);

    const result = await notificationService.createNotification(notificationData);
    
    return {
      success: true,
      templateName,
      result,
      message: 'Template test successful'
    };
  } catch (error) {
    console.error(`Template test failed for ${templateName}:`, error);
    
    return {
      success: false,
      templateName,
      error: error.response?.data || error.message,
      message: `Template test failed: ${error.message}`
    };
  }
};

/**
 * Test all available email templates
 * @param {Object} baseTestData - Base test data to use for all templates
 * @returns {Promise<Array>} Array of test results
 */
export const testAllEmailTemplates = async (baseTestData = {}) => {
  try {
    // First, get all available templates
    const templatesResponse = await notificationService.getEmailTemplates();
    const templates = templatesResponse?.templates || [];

    if (templates.length === 0) {
      return [{
        success: false,
        message: 'No email templates found',
        error: 'No templates available for testing'
      }];
    }

    console.log(`Testing ${templates.length} email templates...`);

    const results = [];

    // Test each template with a delay to avoid overwhelming the server
    for (const template of templates) {
      try {
        // Wait 1 second between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await testEmailTemplate(template.name, baseTestData);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          templateName: template.name,
          error: error.message,
          message: `Failed to test template: ${template.name}`
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Failed to test email templates:', error);
    return [{
      success: false,
      message: 'Failed to load email templates',
      error: error.message
    }];
  }
};

/**
 * Validate email template data
 * @param {Object} templateData - Template data to validate
 * @returns {Object} Validation result
 */
export const validateEmailTemplate = (templateData) => {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!templateData.name) {
    errors.push('Template name is required');
  }

  if (!templateData.subject) {
    warnings.push('Template subject is missing');
  }

  // Check for common template variables
  const commonVariables = ['title', 'message', 'user_name'];
  const hasVariables = templateData.variables && Object.keys(templateData.variables).length > 0;
  
  if (!hasVariables) {
    warnings.push('Template has no defined variables');
  } else {
    const templateVars = Object.keys(templateData.variables);
    const missingCommonVars = commonVariables.filter(v => !templateVars.includes(v));
    
    if (missingCommonVars.length > 0) {
      warnings.push(`Missing common variables: ${missingCommonVars.join(', ')}`);
    }
  }

  // Check HTML content
  if (!templateData.html_content) {
    warnings.push('Template has no HTML content');
  }

  // Check text content
  if (!templateData.text_content) {
    warnings.push('Template has no text content (fallback)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 25) - (warnings.length * 10))
  };
};

/**
 * Generate test notification data for different scenarios
 * @param {string} scenario - Test scenario name
 * @returns {Object} Test notification data
 */
export const generateTestData = (scenario = 'default') => {
  const baseData = {
    type: 'info',
    priority: 'normal',
    target_type: 'all',
    send_email: true,
  };

  const scenarios = {
    default: {
      ...baseData,
      title: 'Default Test Notification',
      message: 'This is a default test notification to verify basic functionality.',
      email_subject: 'Default Test Email',
    },
    
    announcement: {
      ...baseData,
      type: 'announcement',
      priority: 'high',
      title: 'Important Announcement Test',
      message: 'This is a test announcement with high priority.',
      email_subject: 'Important Announcement - Test',
    },
    
    urgent: {
      ...baseData,
      type: 'error',
      priority: 'urgent',
      title: 'Urgent Notification Test',
      message: 'This is an urgent test notification that requires immediate attention.',
      email_subject: 'URGENT: Test Notification',
    },
    
    reminder: {
      ...baseData,
      type: 'warning',
      priority: 'normal',
      title: 'Reminder Test',
      message: 'This is a test reminder notification.',
      email_subject: 'Reminder: Test Notification',
    },
    
    success: {
      ...baseData,
      type: 'success',
      priority: 'low',
      title: 'Success Notification Test',
      message: 'This is a test success notification.',
      email_subject: 'Success: Test Notification',
    }
  };

  return scenarios[scenario] || scenarios.default;
};

/**
 * Log test results in a formatted way
 * @param {Array} results - Array of test results
 */
export const logTestResults = (results) => {
  console.group('📧 Email Template Test Results');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📊 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  
  if (failed.length > 0) {
    console.group('❌ Failed Tests');
    failed.forEach(result => {
      console.error(`${result.templateName || 'Unknown'}: ${result.message}`);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    });
    console.groupEnd();
  }
  
  if (successful.length > 0) {
    console.group('✅ Successful Tests');
    successful.forEach(result => {
      console.log(`${result.templateName}: ${result.message}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
};

export default {
  testEmailTemplate,
  testAllEmailTemplates,
  validateEmailTemplate,
  generateTestData,
  logTestResults
};
