import apiClient from './apiClient';

// Mock data for development
const MOCK_USERS = [
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
];

// For development/testing - use mock data
const MOCK_API = true;

const userService = {
  getUsers: async (page = 0, size = 10, filters = {}) => {
    if (MOCK_API) {
      // Filter mock users based on filters
      let filteredUsers = [...MOCK_USERS];
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      if (filters.email) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(filters.email.toLowerCase())
        );
      }
      
      if (filters.name) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(filters.name.toLowerCase()) ||
          user.surname.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      // Paginate
      const start = page * size;
      const end = start + size;
      const paginatedUsers = filteredUsers.slice(start, end);
      
      return {
        content: paginatedUsers,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        size,
        number: page,
      };
    } else {
      // Build query params
      const params = { page, size };
      
      // Add filters to params
      if (filters.role) params.role = filters.role;
      if (filters.email) params.email = filters.email;
      if (filters.name) params.name = filters.name;
      
      const response = await apiClient.get('/user/users', { params });
      return response.data;
    }
  },
  
  getUserById: async (id) => {
    if (MOCK_API) {
      const user = MOCK_USERS.find(u => u.id === parseInt(id));
      if (!user) throw new Error('User not found');
      return user;
    } else {
      const response = await apiClient.get(`/user/${id}`);
      return response.data;
    }
  },
  
  createUser: async (userData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_USERS.map(u => u.id)) + 1;
      
      // Create new user
      const newUser = {
        id: newId,
        keycloakID: `user-${newId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        ...userData,
      };
      
      // Add to mock data
      MOCK_USERS.push(newUser);
      
      return newUser;
    } else {
      const response = await apiClient.post('/user', userData);
      return response.data;
    }
  },
  
  updateUser: async (id, userData) => {
    if (MOCK_API) {
      const index = MOCK_USERS.findIndex(u => u.id === parseInt(id));
      if (index === -1) throw new Error('User not found');
      
      // Update user
      const updatedUser = {
        ...MOCK_USERS[index],
        ...userData,
        updatedAt: new Date().toISOString(),
        version: MOCK_USERS[index].version + 1,
      };
      
      // Replace in mock data
      MOCK_USERS[index] = updatedUser;
      
      return updatedUser;
    } else {
      const response = await apiClient.put(`/user/${id}`, userData);
      return response.data;
    }
  },
  
  deleteUser: async (id) => {
    if (MOCK_API) {
      const index = MOCK_USERS.findIndex(u => u.id === parseInt(id));
      if (index === -1) throw new Error('User not found');
      
      // Remove from mock data
      MOCK_USERS.splice(index, 1);
      
      return { success: true };
    } else {
      const response = await apiClient.delete(`/user/${id}`);
      return response.data;
    }
  },
};

export default userService;
