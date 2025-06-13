# Backend API Requirements for Semester Registration Management

## Current Implementation Status

The frontend has been implemented to work with existing endpoints where possible, but some new endpoints are needed for full functionality.

## ✅ Working with Existing Endpoints

### 1. Semester Management

-  **GET /semester/with-breaks** - ✅ Working
-  **GET /semester/:id** - ✅ Working
-  **POST /semester** - ✅ Working (needs registration date support)
-  **PUT /semester/:id** - ✅ Working (needs registration date support)

### 2. Thread Student Management

-  **POST /thread/:threadId/students/:userId** - ✅ Working
-  **DELETE /thread/:threadId/students/:userId** - ✅ Working

## 🔄 Needs Backend Updates

### 1. Semester Creation/Update with Registration Dates

**Current:** Basic semester creation
**Needed:** Support for registration time frame fields

```json
POST/PUT /semester/:id
{
  "name": "Spring 2025",
  "start_date": "2025-02-01T00:00:00Z",
  "end_date": "2025-06-30T23:59:59Z",
  "registration_start_date": "2025-01-15T09:00:00Z",  // NEW
  "registration_end_date": "2025-02-15T23:59:59Z"     // NEW
}
```

**Database Changes Needed:**

```sql
ALTER TABLE semesters
ADD COLUMN registration_start_date TIMESTAMP NULL,
ADD COLUMN registration_end_date TIMESTAMP NULL;
```

## ✅ Working Endpoints

### 1. Registration Status Check

```
GET /semester/:id/registration-status

Response:
{
  "is_open": true,
  "registration_start_date": null,
  "registration_end_date": null,
  "semester": {
    "id": 1,
    "name": "Spring 2025",
    "start_date": {
      "seconds": 1738368000
    },
    "end_date": {
      "seconds": 1751241600
    },
    "created_at": {
      "seconds": 1749731326,
      "nanos": 394260000
    },
    "updated_at": {
      "seconds": 1749731326,
      "nanos": 394260000
    }
  }
}
```

**Status:** ✅ **IMPLEMENTED AND WORKING**

-  Backend endpoint is functional
-  Returns proper registration status
-  Includes semester data with Firebase timestamp format
-  Frontend properly handles the response format

## 🆕 New Endpoints Still Needed

### 2. Thread Registration with Validation

```
POST /thread/register
{
  "user_id": 123,
  "thread_id": 456
}

Success Response:
{
  "message": "Student registered successfully",
  "user_id": 123,
  "thread_id": 456
}

Error Responses:
- 412 Precondition Failed: {"error": "registration is closed for this semester"}
- 409 Conflict: {"error": "student is already registered"}
- 429 Too Many Requests: {"error": "thread is full"}
```

### 3. Bulk Thread Registration

```
POST /thread/register_many
{
  "user_ids": [123, 124, 125],
  "thread_id": 456
}

Response:
{
  "message": "Registered 2 of 3 students successfully",
  "successful_registrations": 2,
  "failed_registrations": 1,
  "results": [
    {"user_id": 123, "status": "success"},
    {"user_id": 124, "status": "success"},
    {"user_id": 125, "status": "failed", "error": "student already registered"}
  ]
}
```

## 🔧 Implementation Priority

### Phase 1: Basic Registration Time Frame Support

1. **Database Schema Update**

   -  Add registration date columns to semesters table
   -  Update semester creation/update endpoints

2. **Registration Status Endpoint**
   -  Implement `/semester/:id/registration-status`
   -  Add server-side logic for time validation

### Phase 2: Enhanced Registration Endpoints

1. **Thread Registration with Validation**

   -  Implement `/thread/register` with semester time validation
   -  Add proper error responses for different scenarios

2. **Bulk Registration**
   -  Implement `/thread/register_many` for efficient bulk operations
   -  Include detailed success/failure reporting

### Phase 3: Advanced Features (Future)

1. **Registration Analytics**

   -  Track registration patterns and statistics
   -  Generate reports on registration activity

2. **Notification Integration**
   -  Send notifications when registration opens/closes
   -  Alert administrators of registration issues

## 🛠️ Current Frontend Fallbacks

The frontend currently implements these fallbacks:

1. **Registration Status**: Calculates client-side using semester data
2. **Single Registration**: Uses existing `/thread/:threadId/students/:userId` endpoint
3. **Bulk Registration**: Loops through individual registrations
4. **Error Handling**: Provides user-friendly messages for common scenarios

## 🧪 Testing the Current Implementation

You can test the current functionality:

1. **Navigate to Registration Management**: `/registration-management`
2. **Create Semester with Registration Dates**: Use the "Add Semester" button
3. **View Registration Status**: Select semesters to see calculated status
4. **Thread Management**: Select threads to see registration interface

## 📋 Backend Implementation Checklist

### Database Changes

-  [ ] Add `registration_start_date` column to semesters table
-  [ ] Add `registration_end_date` column to semesters table
-  [ ] Update existing semester records (set NULL for unlimited registration)

### API Endpoints

-  [ ] Update POST/PUT `/semester` to accept registration dates
-  [ ] Implement GET `/semester/:id/registration-status`
-  [ ] Implement POST `/thread/register` with validation
-  [ ] Implement POST `/thread/register_many`

### Validation Logic

-  [ ] Server-side registration time validation
-  [ ] Thread capacity checking
-  [ ] Duplicate registration prevention
-  [ ] Proper error response formatting

### Testing

-  [ ] Unit tests for registration time logic
-  [ ] Integration tests for registration endpoints
-  [ ] Error scenario testing
-  [ ] Performance testing for bulk operations

## 🔗 Integration Notes

The frontend is designed to gracefully handle missing endpoints:

-  Falls back to existing functionality when new endpoints aren't available
-  Provides clear error messages when features aren't fully supported
-  Maintains backward compatibility with existing semester management

Once the backend endpoints are implemented, the frontend will automatically use the enhanced functionality without requiring code changes.
