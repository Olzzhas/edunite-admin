/**
 * Utility functions for processing email templates
 */

/**
 * Process email templates from API response
 * Parses JSON variables and decodes HTML/text content
 * @param {Array} templates - Raw templates from API
 * @returns {Array} Processed templates
 */
export const processEmailTemplates = (templates) => {
  if (!Array.isArray(templates)) {
    console.warn('processEmailTemplates: Expected array, got:', typeof templates);
    return [];
  }

  return templates.map(template => {
    let variables = {};
    
    // Parse variables JSON string
    try {
      if (template.variables && typeof template.variables === 'string') {
        variables = JSON.parse(template.variables);
      } else if (template.variables && typeof template.variables === 'object') {
        variables = template.variables;
      }
    } catch (error) {
      console.warn(`Failed to parse variables for template ${template.name}:`, error);
      variables = {};
    }

    // Decode HTML content
    let htmlContent = template.html_content || '';
    if (htmlContent) {
      htmlContent = htmlContent
        .replace(/\\u003c/g, '<')
        .replace(/\\u003e/g, '>')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    // Decode text content
    let textContent = template.text_content || '';
    if (textContent) {
      textContent = textContent
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    return {
      ...template,
      variables,
      html_content: htmlContent,
      text_content: textContent
    };
  });
};

/**
 * Get template variables as array of keys
 * @param {Object} template - Processed template object
 * @returns {Array} Array of variable names
 */
export const getTemplateVariables = (template) => {
  if (!template || !template.variables) {
    return [];
  }
  
  return Object.keys(template.variables);
};

/**
 * Validate template variables
 * @param {Object} template - Template object
 * @param {Object} data - Data to validate against template
 * @returns {Object} Validation result
 */
export const validateTemplateData = (template, data) => {
  const result = {
    valid: true,
    missingVariables: [],
    extraVariables: [],
    warnings: []
  };

  if (!template || !template.variables) {
    result.warnings.push('Template has no defined variables');
    return result;
  }

  const templateVars = Object.keys(template.variables);
  const dataVars = Object.keys(data || {});

  // Check for missing required variables
  result.missingVariables = templateVars.filter(varName => 
    !(varName in (data || {}))
  );

  // Check for extra variables (not necessarily an error)
  result.extraVariables = dataVars.filter(varName => 
    !templateVars.includes(varName)
  );

  if (result.missingVariables.length > 0) {
    result.valid = false;
  }

  return result;
};

/**
 * Preview template with data
 * @param {Object} template - Template object
 * @param {Object} data - Data to substitute
 * @returns {Object} Preview result
 */
export const previewTemplate = (template, data = {}) => {
  if (!template) {
    return {
      subject: '',
      htmlContent: '',
      textContent: '',
      errors: ['Template not found']
    };
  }

  const validation = validateTemplateData(template, data);
  const errors = [];

  if (!validation.valid) {
    errors.push(`Missing variables: ${validation.missingVariables.join(', ')}`);
  }

  // Simple template variable substitution
  const substituteVariables = (content, variables) => {
    if (!content) return '';
    
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*\\.?${key}\\s*}}`, 'g');
      result = result.replace(regex, value || `[${key}]`);
    });
    
    return result;
  };

  const subject = substituteVariables(template.subject || '', data);
  const htmlContent = substituteVariables(template.html_content || '', data);
  const textContent = substituteVariables(template.text_content || '', data);

  return {
    subject,
    htmlContent,
    textContent,
    errors,
    warnings: validation.warnings
  };
};

/**
 * Get default test data for a template
 * @param {Object} template - Template object
 * @returns {Object} Default test data
 */
export const getDefaultTestData = (template) => {
  if (!template || !template.variables) {
    return {};
  }

  const testData = {};
  Object.entries(template.variables).forEach(([key, description]) => {
    // Generate sample data based on variable name and description
    switch (key.toLowerCase()) {
      case 'user_name':
      case 'username':
        testData[key] = 'Иван Иванов';
        break;
      case 'title':
        testData[key] = 'Тестовый заголовок';
        break;
      case 'message':
        testData[key] = 'Это тестовое сообщение для проверки шаблона.';
        break;
      case 'course_name':
        testData[key] = 'Введение в программирование';
        break;
      case 'teacher_name':
        testData[key] = 'Петр Петрович';
        break;
      case 'assignment_title':
        testData[key] = 'Домашнее задание №1';
        break;
      case 'deadline':
        testData[key] = '2024-02-15 23:59';
        break;
      case 'grade':
        testData[key] = '85';
        break;
      case 'feedback':
        testData[key] = 'Хорошая работа! Есть небольшие замечания.';
        break;
      case 'class_time':
        testData[key] = '10:00 - 11:30';
        break;
      case 'classroom':
        testData[key] = 'Аудитория 101';
        break;
      default:
        testData[key] = description || `Тестовое значение для ${key}`;
    }
  });

  return testData;
};

/**
 * Format template info for display
 * @param {Object} template - Template object
 * @returns {Object} Formatted template info
 */
export const formatTemplateInfo = (template) => {
  if (!template) {
    return {
      name: 'Unknown',
      subject: 'No subject',
      variableCount: 0,
      variables: [],
      hasHtml: false,
      hasText: false
    };
  }

  return {
    name: template.name || 'Unknown',
    subject: template.subject || 'No subject',
    variableCount: Object.keys(template.variables || {}).length,
    variables: getTemplateVariables(template),
    hasHtml: !!(template.html_content && template.html_content.trim()),
    hasText: !!(template.text_content && template.text_content.trim())
  };
};
