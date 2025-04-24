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

// Use real API data
const MOCK_API = false;

const userService = {
  getUsers: async (page = 1, size = 10, filters = {}) => {
    if (MOCK_API) {
      // Filter mock users based on filters
      let filteredUsers = [...MOCK_USERS];

      if (filters.role && filters.role !== '') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.email && filters.email !== '') {
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(filters.email.toLowerCase())
        );
      }

      if (filters.name && filters.name !== '') {
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
      try {
        // Build query params according to the API requirements
        const params = {
          page: page,
          page_size: size,
          sort: '-created_at'  // Default sort by created_at descending
        };

        console.log(`Requesting page ${page} with page_size ${size}`);

        // Combine email and name filters into a single search parameter if either exists
        if ((filters.email && filters.email !== '') || (filters.name && filters.name !== '')) {
          params.search = filters.email || filters.name;
        }

        console.log('API request params:', params);

        const response = await apiClient.get('/user/users', { params });

        // Log the raw API response for debugging
        console.log('Raw API response:', response.data);

        // Handle case where API returns null, undefined, or non-standard response
        if (!response.data || typeof response.data !== 'object') {
          console.warn('API returned invalid data format, normalizing response');
          return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size,
            number: page,
          };
        }

        // Handle the specific API response format with users array
        if (response.data.users) {
          console.log('Received API response with users array');
          return response.data;
        }

        // Handle case where API returns array instead of paginated object
        if (Array.isArray(response.data)) {
          console.warn('API returned array instead of paginated object, normalizing response');
          const content = response.data;
          return {
            users: content,
            current_page: page,
            page_size: size,
            first_page: 1,
            last_page: Math.ceil(content.length / size),
            total_records: content.length,
          };
        }

        // Handle case where API returns paginated object but missing some fields
        if (!response.data.users && !response.data.content) {
          response.data.users = [];
        }

        if (response.data.total_records === undefined && response.data.totalElements === undefined) {
          response.data.total_records = response.data.users ? response.data.users.length : 0;
        }

        if (response.data.last_page === undefined && response.data.totalPages === undefined) {
          response.data.last_page = Math.ceil((response.data.total_records || 0) / size);
        }

        if (response.data.page_size === undefined && response.data.size === undefined) {
          response.data.page_size = size;
        }

        if (response.data.current_page === undefined && response.data.number === undefined) {
          response.data.current_page = page;
        }

        return response.data;
      } catch (error) {
        // If there's a connection error, fall back to mock data
        if (error.isConnectionError) {
          console.warn('API connection error, falling back to mock data for users');

          // Use the mock implementation as fallback
          let filteredUsers = [...MOCK_USERS];

          if (filters.role && filters.role !== '') {
            filteredUsers = filteredUsers.filter(user => user.role === filters.role);
          }

          if (filters.email && filters.email !== '') {
            filteredUsers = filteredUsers.filter(user =>
              user.email.toLowerCase().includes(filters.email.toLowerCase())
            );
          }

          if (filters.name && filters.name !== '') {
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
        }

        // Re-throw other errors
        throw error;
      }
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
