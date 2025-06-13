# Semester Registration Management - User Guide

## Overview

The Semester Registration Management feature allows administrators to control when students can register for courses within specific semesters. This provides better control over the enrollment process and helps manage course capacity.

## Features

### 1. Semester Registration Time Frames
- Set specific start and end dates/times for student registration
- Optional feature - leave empty for unlimited registration
- Automatic validation during student registration attempts

### 2. Registration Status Monitoring
- Real-time status checking for each semester
- Visual indicators for open/closed registration periods
- Detailed time frame information display

### 3. Thread Registration Management
- Integration with existing thread (course section) system
- Automatic validation against semester registration windows
- Bulk student registration capabilities

## How to Use

### Creating a Semester with Registration Time Frames

1. **Navigate to Registration Management**
   - Go to the sidebar and click "Registration Management"
   - Or visit `/registration-management` directly

2. **Add New Semester**
   - Click the "Add Semester" button
   - Fill in the basic semester information:
     - Semester Name (required)
     - Start Date (required)
     - End Date (required)

3. **Set Registration Time Frame (Optional)**
   - In the "Registration Time Frame" section:
     - **Registration Start Date**: When students can begin registering
     - **Registration End Date**: When registration closes
   - Leave both fields empty to allow registration at any time

4. **Validation Rules**
   - Registration end date must be after registration start date
   - Registration dates should typically be before the semester start date
   - All dates are validated automatically

### Managing Registration Status

1. **View Registration Status**
   - Select a semester from the left panel
   - The registration status card shows:
     - Current status (Open/Closed)
     - Registration start and end times
     - Time restrictions information

2. **Refresh Status**
   - Click "Refresh" to update the registration status
   - Status is automatically checked when selecting semesters

### Thread Registration

1. **Select a Thread**
   - Choose a semester to see its threads
   - Click on a thread to manage its registration

2. **Registration Validation**
   - The system automatically checks if registration is open
   - Displays appropriate messages for closed registration periods
   - Shows thread capacity and current enrollment

## API Integration

### Backend Requirements

The frontend expects these API endpoints to be implemented:

#### 1. Create/Update Semester with Registration Dates
```
POST /semester
PUT /semester/:id

Body:
{
  "name": "Spring 2025",
  "start_date": "2025-02-01T00:00:00Z",
  "end_date": "2025-06-30T23:59:59Z",
  "registration_start_date": "2025-01-15T09:00:00Z",  // Optional
  "registration_end_date": "2025-02-15T23:59:59Z"     // Optional
}
```

#### 2. Check Registration Status
```
GET /semester/:id/registration-status

Response:
{
  "is_open": true,
  "registration_start_date": "2025-01-15T09:00:00Z",
  "registration_end_date": "2025-02-15T23:59:59Z"
}
```

#### 3. Register Students with Validation
```
POST /thread/register
{
  "user_id": 123,
  "thread_id": 456
}

POST /thread/register_many
{
  "user_ids": [123, 124, 125],
  "thread_id": 456
}

Error Responses:
- 412 Precondition Failed: "registration is closed for this semester"
- 409 Conflict: "student is already registered"
- 429 Too Many Requests: "thread is full"
```

## Error Handling

### Registration Closed
When registration is closed, users will see:
- Clear error messages explaining why registration failed
- Information about when registration will open/close
- Visual indicators showing closed status

### Validation Errors
The system validates:
- Date formats and logical ordering
- Registration time frame consistency
- Thread capacity limits
- Duplicate registrations

## Best Practices

### 1. Setting Registration Periods
- Open registration 1-2 weeks before semester starts
- Close registration by the semester start date
- Consider time zones when setting exact times

### 2. Communication
- Notify students about registration periods
- Use the notification system to announce changes
- Provide clear instructions about registration deadlines

### 3. Monitoring
- Regularly check registration status
- Monitor thread capacity during registration periods
- Use analytics to track registration patterns

## Troubleshooting

### Common Issues

1. **Registration Status Not Updating**
   - Click the "Refresh" button
   - Check browser console for API errors
   - Verify backend API is responding

2. **Date/Time Issues**
   - Ensure dates are in correct format (RFC3339)
   - Check time zone settings
   - Validate date logic (end after start)

3. **Registration Failures**
   - Check semester registration status
   - Verify thread capacity
   - Confirm student eligibility

### Support

For technical issues:
1. Check browser console for errors
2. Verify API endpoint responses
3. Review server logs for backend issues
4. Contact system administrator if problems persist

## Future Enhancements

Planned features:
- Email notifications for registration periods
- Waitlist management for full threads
- Advanced registration rules (prerequisites, etc.)
- Bulk registration import/export
- Registration analytics and reporting
