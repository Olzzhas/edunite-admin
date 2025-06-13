# Email Notification Troubleshooting Guide

## Проблема: В email отображается только название шаблона

### Описание проблемы
При отправке email уведомлений через админ панель в теле письма отображается только название шаблона (например, "default_notification") вместо корректного HTML содержимого.

### Возможные причины

1. **Backend не загружает шаблоны из базы данных**
   - Шаблоны не сохранены в базе данных
   - Ошибка в SQL запросе для получения шаблонов
   - Проблемы с подключением к базе данных

2. **Неправильная обработка переменных в шаблонах**
   - Переменные {{title}}, {{message}} не заменяются на реальные значения
   - Ошибка в парсинге HTML шаблона

3. **Frontend отправляет неправильные данные**
   - Неправильное название шаблона
   - Отсутствуют обязательные поля

### Диагностика

#### 1. Проверка Frontend

```javascript
// Откройте консоль браузера и проверьте логи при отправке уведомления
// Должны появиться следующие сообщения:

// Loading email templates...
// Email templates API response: {...}
// Sending notification data: {...}
// Using email template: {...}
// Notification creation result: {...}
```

#### 2. Проверка API шаблонов

```bash
# Проверьте доступность API шаблонов
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8081/email-templates

# Ожидаемый ответ:
{
  "templates": [
    {
      "id": 1,
      "name": "default_notification",
      "subject": "Новое уведомление - {{title}}",
      "html_content": "<html>...</html>",
      "text_content": "{{title}}\n\n{{message}}...",
      "variables": {
        "title": "Заголовок уведомления",
        "message": "Текст сообщения"
      },
      "is_active": true
    }
  ],
  "total_count": 7
}
```

#### 3. Проверка отправки уведомления

```bash
# Тестовая отправка уведомления
curl -X POST http://localhost:8081/notifications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Тест",
    "message": "Тестовое сообщение",
    "type": "info",
    "target_type": "all",
    "send_email": true,
    "email_subject": "Тест",
    "email_template": "default_notification"
  }'
```

### Решения

#### 1. Использование тестовой страницы

1. Перейдите в админ панели в раздел **System → Notification Test**
2. Нажмите **Reload Templates** для загрузки шаблонов
3. Используйте **Test All Templates** для проверки всех шаблонов
4. Проверьте результаты в разделе **Test Results**

#### 2. Проверка логов в консоли

1. Откройте Developer Tools (F12)
2. Перейдите на вкладку Console
3. Отправьте тестовое уведомление
4. Проверьте логи на наличие ошибок

#### 3. Проверка данных шаблонов

```javascript
// В консоли браузера выполните:
import { notificationService } from './src/services/api';

// Получить все шаблоны
const templates = await notificationService.getEmailTemplates();
console.log('Templates:', templates);

// Проверить конкретный шаблон
const defaultTemplate = templates.templates.find(t => t.name === 'default_notification');
console.log('Default template:', defaultTemplate);
```

### Типичные ошибки и их исправление

#### Ошибка 1: "Email template not found"
```javascript
// Проблема: шаблон не найден в базе данных
// Решение: проверить название шаблона и его наличие в БД

// Проверка доступных шаблонов:
const templates = await notificationService.getEmailTemplates();
console.log('Available templates:', templates.templates.map(t => t.name));
```

#### Ошибка 2: "Authorization header required"
```javascript
// Проблема: отсутствует токен авторизации
// Решение: проверить токен в localStorage

console.log('Access token:', localStorage.getItem('accessToken'));
```

#### Ошибка 3: Пустой ответ от API
```javascript
// Проблема: API возвращает пустой массив шаблонов
// Решение: проверить базу данных и убедиться, что шаблоны созданы

// Проверка ответа API:
const response = await fetch('http://localhost:8081/email-templates', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
const data = await response.json();
console.log('API response:', data);
```

### Отладочные функции

#### 1. Тестирование конкретного шаблона

```javascript
import { testEmailTemplate } from './src/utils/notificationTestUtils';

// Тест конкретного шаблона
const result = await testEmailTemplate('default_notification', {
  title: 'Тестовое уведомление',
  message: 'Это тестовое сообщение для проверки шаблона'
});

console.log('Test result:', result);
```

#### 2. Массовое тестирование

```javascript
import { testAllEmailTemplates, logTestResults } from './src/utils/notificationTestUtils';

// Тест всех шаблонов
const results = await testAllEmailTemplates();
logTestResults(results);
```

#### 3. Валидация шаблона

```javascript
import { validateEmailTemplate } from './src/utils/notificationTestUtils';

// Валидация шаблона
const template = {
  name: 'default_notification',
  subject: 'Test {{title}}',
  html_content: '<p>{{message}}</p>',
  variables: { title: 'Title', message: 'Message' }
};

const validation = validateEmailTemplate(template);
console.log('Validation result:', validation);
```

### Контрольный список

- [ ] API сервер уведомлений запущен на порту 8081
- [ ] Токен авторизации действителен
- [ ] Шаблоны email загружаются через API `/email-templates`
- [ ] В консоли нет ошибок при отправке уведомлений
- [ ] Тестовая страница показывает доступные шаблоны
- [ ] Backend корректно обрабатывает переменные в шаблонах
- [ ] Email отправляется с правильным HTML содержимым

### Дополнительные ресурсы

- **Документация API**: См. файл с документацией API уведомлений
- **Тестовая страница**: `/notification-test` в админ панели
- **Логи сервера**: Проверьте логи backend сервера на наличие ошибок
- **База данных**: Убедитесь, что таблица email_templates содержит данные

### Контакты для поддержки

При возникновении проблем, которые не удается решить с помощью этого руководства:

1. Проверьте логи backend сервера
2. Убедитесь, что база данных содержит email шаблоны
3. Проверьте конфигурацию SMTP для отправки email
4. Обратитесь к backend разработчику с подробным описанием проблемы и логами
