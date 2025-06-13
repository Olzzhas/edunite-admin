// Mock users
export const MOCK_USERS = [
  {
    id: 1,
    keycloakID: 'admin-123',
    name: 'Admin',
    surname: 'User',
    email: 'admin@edunite.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    version: 1,
  },
  {
    id: 2,
    keycloakID: 'teacher-123',
    name: 'Teacher',
    surname: 'Smith',
    email: 'teacher@edunite.com',
    role: 'teacher',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    version: 1,
  },
  {
    id: 3,
    keycloakID: 'student-123',
    name: 'Student',
    surname: 'Johnson',
    email: 'student@edunite.com',
    role: 'student',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
    version: 1,
  },
  {
    id: 4,
    keycloakID: 'student-456',
    name: 'Jane',
    surname: 'Doe',
    email: 'jane@edunite.com',
    role: 'student',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
    version: 1,
  },
  {
    id: 5,
    keycloakID: 'student-789',
    name: 'Bob',
    surname: 'Brown',
    email: 'bob@edunite.com',
    role: 'student',
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z',
    version: 1,
  },
];

// Mock courses
export const MOCK_COURSES = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    description: 'A beginner-friendly introduction to computer science concepts.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Computer+Science',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Advanced Mathematics',
    description: 'Explore advanced mathematical concepts and their applications.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Mathematics',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Web+Development',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
];

// Mock semesters
export const MOCK_SEMESTERS = [
  {
    id: 1,
    name: 'Spring 2023',
    startDate: '2023-01-15T00:00:00Z',
    endDate: '2023-05-15T00:00:00Z',
    registrationStartDate: '2023-01-01T09:00:00Z',
    registrationEndDate: '2023-01-10T23:59:59Z',
    breaks: [
      {
        id: 1,
        name: 'Spring Break',
        startDate: '2023-03-10T00:00:00Z',
        endDate: '2023-03-20T00:00:00Z',
      }
    ],
  },
  {
    id: 2,
    name: 'Fall 2023',
    startDate: '2023-08-15T00:00:00Z',
    endDate: '2023-12-15T00:00:00Z',
    registrationStartDate: '2023-08-01T09:00:00Z',
    registrationEndDate: '2023-08-10T23:59:59Z',
    breaks: [
      {
        id: 2,
        name: 'Thanksgiving Break',
        startDate: '2023-11-22T00:00:00Z',
        endDate: '2023-11-26T00:00:00Z',
      }
    ],
  },
  {
    id: 3,
    name: 'Spring 2024',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-05-15T00:00:00Z',
    registrationStartDate: '2024-12-15T09:00:00Z',
    registrationEndDate: '2025-01-10T23:59:59Z',
    breaks: [
      {
        id: 3,
        name: 'Spring Break',
        startDate: '2024-03-10T00:00:00Z',
        endDate: '2024-03-20T00:00:00Z',
      }
    ],
  },
];

// Mock assignments
export const MOCK_ASSIGNMENT_GROUPS = [
  {
    id: 1,
    threadId: 1,
    name: 'Homework',
    weight: 30,
    assignments: [
      {
        id: 1,
        groupId: 1,
        weekId: 1,
        title: 'Introduction Assignment',
        description: 'Complete the introductory exercises.',
        dueDate: '2023-01-22T23:59:59Z',
        attachments: [
          {
            id: 1,
            name: 'assignment1.pdf',
            url: 'https://example.com/files/assignment1.pdf',
            uploadedAt: '2023-01-15T10:00:00Z',
          }
        ],
      },
      {
        id: 2,
        groupId: 1,
        weekId: 2,
        title: 'Week 2 Homework',
        description: 'Complete the exercises for week 2.',
        dueDate: '2023-01-29T23:59:59Z',
        attachments: [],
      },
    ],
  },
  {
    id: 2,
    threadId: 1,
    name: 'Projects',
    weight: 40,
    assignments: [
      {
        id: 3,
        groupId: 2,
        weekId: 5,
        title: 'Midterm Project',
        description: 'Complete the midterm project as described in the document.',
        dueDate: '2023-02-19T23:59:59Z',
        attachments: [
          {
            id: 2,
            name: 'midterm_project.pdf',
            url: 'https://example.com/files/midterm_project.pdf',
            uploadedAt: '2023-02-05T10:00:00Z',
          }
        ],
      },
    ],
  },
  {
    id: 3,
    threadId: 1,
    name: 'Exams',
    weight: 30,
    assignments: [
      {
        id: 4,
        groupId: 3,
        weekId: 8,
        title: 'Midterm Exam',
        description: 'Midterm examination covering weeks 1-7.',
        dueDate: '2023-03-05T23:59:59Z',
        attachments: [],
      },
      {
        id: 5,
        groupId: 3,
        weekId: 16,
        title: 'Final Exam',
        description: 'Final examination covering all course material.',
        dueDate: '2023-05-10T23:59:59Z',
        attachments: [],
      },
    ],
  },
];

// Mock attendance records
export const MOCK_ATTENDANCE = [
  {
    id: 1,
    threadId: 1,
    date: '2023-01-16T09:00:00Z',
    records: [
      { studentId: 3, status: 'PRESENT' },
      { studentId: 4, status: 'PRESENT' },
      { studentId: 5, status: 'ABSENT' },
    ],
  },
  {
    id: 2,
    threadId: 1,
    date: '2023-01-18T09:00:00Z',
    records: [
      { studentId: 3, status: 'PRESENT' },
      { studentId: 4, status: 'LATE' },
      { studentId: 5, status: 'PRESENT' },
    ],
  },
  {
    id: 3,
    threadId: 2,
    date: '2023-01-17T13:00:00Z',
    records: [
      { studentId: 3, status: 'PRESENT' },
      { studentId: 4, status: 'PRESENT' },
    ],
  },
];

// Mock storage files
export const MOCK_STORAGE_FILES = [
  {
    id: 1,
    bucket: 'assignments',
    object: 'assignment1.pdf',
    size: 1024 * 1024, // 1MB
    contentType: 'application/pdf',
    uploadedAt: '2023-01-15T10:00:00Z',
    uploadedBy: 2, // Teacher ID
  },
  {
    id: 2,
    bucket: 'assignments',
    object: 'midterm_project.pdf',
    size: 2 * 1024 * 1024, // 2MB
    contentType: 'application/pdf',
    uploadedAt: '2023-02-05T10:00:00Z',
    uploadedBy: 2, // Teacher ID
  },
  {
    id: 3,
    bucket: 'submissions',
    object: 'student1_assignment1.pdf',
    size: 512 * 1024, // 512KB
    contentType: 'application/pdf',
    uploadedAt: '2023-01-20T15:30:00Z',
    uploadedBy: 3, // Student ID
  },
];
