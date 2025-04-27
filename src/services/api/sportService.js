import sportApiClient from './sportApiClient';

// Mock data for development
const MOCK_SPORT_TYPES = [
  {
    id: 1,
    name: 'Basketball',
    description: 'Basketball training',
    maxParticipants: 20,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Football',
    description: 'Football training',
    maxParticipants: 22,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Swimming',
    description: 'Swimming lessons',
    maxParticipants: 15,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
  {
    id: 4,
    name: 'Tennis',
    description: 'Tennis training',
    maxParticipants: 4,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
  {
    id: 5,
    name: 'Volleyball',
    description: 'Volleyball training',
    maxParticipants: 12,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z',
  },
];

const MOCK_FACILITIES = [
  {
    id: 1,
    name: 'Main Gym',
    location: 'Building A',
    capacity: 50,
    description: 'Main gymnasium facility',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Swimming Pool',
    location: 'Building B',
    capacity: 30,
    description: 'Olympic-sized swimming pool',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Tennis Court',
    location: 'Outdoor Area C',
    capacity: 8,
    description: 'Outdoor tennis courts',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
  {
    id: 4,
    name: 'Football Field',
    location: 'Outdoor Area D',
    capacity: 30,
    description: 'Standard football field',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
];

const MOCK_BOOKINGS = [
  {
    id: 1,
    userId: 1,
    scheduleId: 1,
    sportTypeId: 1,
    status: 'CONFIRMED',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    scheduleId: 2,
    sportTypeId: 2,
    status: 'PENDING',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    userId: 3,
    scheduleId: 3,
    sportTypeId: 3,
    status: 'CONFIRMED',
    createdAt: '2023-01-03T00:00:00Z',
  },
];

const MOCK_SCHEDULES = [
  {
    id: 1,
    facilityId: 1,
    teacherId: 1,
    sportTypeId: 1,
    weekDay: 'MONDAY',
    startTime: '14:00',
    endTime: '15:30',
    startDate: '2024-01-01',
    endDate: '2024-05-31',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    facilityId: 2,
    teacherId: 2,
    sportTypeId: 2,
    weekDay: 'WEDNESDAY',
    startTime: '16:00',
    endTime: '17:30',
    startDate: '2024-01-01',
    endDate: '2024-05-31',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    facilityId: 3,
    teacherId: 3,
    sportTypeId: 3,
    weekDay: 'FRIDAY',
    startTime: '10:00',
    endTime: '11:30',
    startDate: '2024-01-01',
    endDate: '2024-05-31',
    createdAt: '2023-01-03T00:00:00Z',
  },
];

// Use mock API for development
const MOCK_API = true;

const sportService = {
  // Sport Types
  getSportTypes: async (page = 1, size = 10) => {
    if (MOCK_API) {
      // Paginate
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedSportTypes = MOCK_SPORT_TYPES.slice(start, end);

      return {
        data: paginatedSportTypes,
        meta: {
          total: MOCK_SPORT_TYPES.length,
          page,
          page_size: size
        }
      };
    } else {
      const response = await sportApiClient.get('/sport-types', { params: { page, page_size: size } });
      return response.data;
    }
  },

  getSportTypeById: async (id) => {
    if (MOCK_API) {
      const sportType = MOCK_SPORT_TYPES.find(st => st.id === parseInt(id));
      if (!sportType) throw new Error('Sport type not found');
      return sportType;
    } else {
      const response = await sportApiClient.get(`/sport-types/${id}`);
      return response.data;
    }
  },

  createSportType: async (sportTypeData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_SPORT_TYPES.map(st => st.id)) + 1;

      // Create new sport type
      const newSportType = {
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...sportTypeData,
      };

      // Add to mock data
      MOCK_SPORT_TYPES.push(newSportType);

      return newSportType;
    } else {
      const response = await sportApiClient.post('/sport-types', sportTypeData);
      return response.data;
    }
  },

  updateSportType: async (id, sportTypeData) => {
    if (MOCK_API) {
      const index = MOCK_SPORT_TYPES.findIndex(st => st.id === parseInt(id));
      if (index === -1) throw new Error('Sport type not found');

      // Update sport type
      const updatedSportType = {
        ...MOCK_SPORT_TYPES[index],
        ...sportTypeData,
        updatedAt: new Date().toISOString(),
      };

      // Replace in mock data
      MOCK_SPORT_TYPES[index] = updatedSportType;

      return updatedSportType;
    } else {
      const response = await sportApiClient.put(`/sport-types/${id}`, sportTypeData);
      return response.data;
    }
  },

  deleteSportType: async (id) => {
    if (MOCK_API) {
      const index = MOCK_SPORT_TYPES.findIndex(st => st.id === parseInt(id));
      if (index === -1) throw new Error('Sport type not found');

      // Remove from mock data
      MOCK_SPORT_TYPES.splice(index, 1);

      return { success: true };
    } else {
      const response = await sportApiClient.delete(`/sport-types/${id}`);
      return response.data;
    }
  },

  // Facilities
  getFacilities: async (page = 1, size = 10) => {
    if (MOCK_API) {
      // Paginate
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedFacilities = MOCK_FACILITIES.slice(start, end);

      return {
        data: paginatedFacilities,
        meta: {
          total: MOCK_FACILITIES.length,
          page,
          page_size: size
        }
      };
    } else {
      const response = await sportApiClient.get('/facilities', { params: { page, page_size: size } });
      return response.data;
    }
  },

  getFacilityById: async (id) => {
    if (MOCK_API) {
      const facility = MOCK_FACILITIES.find(f => f.id === parseInt(id));
      if (!facility) throw new Error('Facility not found');
      return facility;
    } else {
      const response = await sportApiClient.get(`/facilities/${id}`);
      return response.data;
    }
  },

  createFacility: async (facilityData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_FACILITIES.map(f => f.id)) + 1;

      // Create new facility
      const newFacility = {
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...facilityData,
      };

      // Add to mock data
      MOCK_FACILITIES.push(newFacility);

      return newFacility;
    } else {
      const response = await sportApiClient.post('/facilities', facilityData);
      return response.data;
    }
  },

  updateFacility: async (id, facilityData) => {
    if (MOCK_API) {
      const index = MOCK_FACILITIES.findIndex(f => f.id === parseInt(id));
      if (index === -1) throw new Error('Facility not found');

      // Update facility
      const updatedFacility = {
        ...MOCK_FACILITIES[index],
        ...facilityData,
        updatedAt: new Date().toISOString(),
      };

      // Replace in mock data
      MOCK_FACILITIES[index] = updatedFacility;

      return updatedFacility;
    } else {
      const response = await sportApiClient.put(`/facilities/${id}`, facilityData);
      return response.data;
    }
  },

  deleteFacility: async (id) => {
    if (MOCK_API) {
      const index = MOCK_FACILITIES.findIndex(f => f.id === parseInt(id));
      if (index === -1) throw new Error('Facility not found');

      // Remove from mock data
      MOCK_FACILITIES.splice(index, 1);

      return { success: true };
    } else {
      const response = await sportApiClient.delete(`/facilities/${id}`);
      return response.data;
    }
  },

  // Physical Education
  getAvailableSportTypes: async (page = 1, size = 10) => {
    if (MOCK_API) {
      return sportService.getSportTypes(page, size);
    } else {
      const response = await sportApiClient.get('/physical-education/sport-types', { params: { page, page_size: size } });
      return response.data;
    }
  },

  getAvailableFacilities: async (page = 1, size = 10) => {
    if (MOCK_API) {
      return sportService.getFacilities(page, size);
    } else {
      const response = await sportApiClient.get('/physical-education/facilities', { params: { page, page_size: size } });
      return response.data;
    }
  },

  bookSession: async (bookingData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_BOOKINGS.map(b => b.id)) + 1;

      // Create new booking
      const newBooking = {
        id: newId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        ...bookingData,
      };

      // Add to mock data
      MOCK_BOOKINGS.push(newBooking);

      return newBooking;
    } else {
      const response = await sportApiClient.post('/physical-education/book', bookingData);
      return response.data;
    }
  },

  cancelBooking: async (id) => {
    if (MOCK_API) {
      const index = MOCK_BOOKINGS.findIndex(b => b.id === parseInt(id));
      if (index === -1) throw new Error('Booking not found');

      // Remove from mock data
      MOCK_BOOKINGS.splice(index, 1);

      return { success: true };
    } else {
      const response = await sportApiClient.delete(`/physical-education/bookings/${id}`);
      return response.data;
    }
  },

  // Schedules
  getSchedules: async () => {
    if (MOCK_API) {
      return MOCK_SCHEDULES;
    } else {
      const response = await sportApiClient.get('/schedules');
      return response.data;
    }
  },

  createWeeklySchedule: async (scheduleData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_SCHEDULES.map(s => s.id)) + 1;

      // Create new schedule
      const newSchedule = {
        id: newId,
        createdAt: new Date().toISOString(),
        ...scheduleData,
      };

      // Add to mock data
      MOCK_SCHEDULES.push(newSchedule);

      return newSchedule;
    } else {
      const response = await sportApiClient.post('/schedules/weekly', scheduleData);
      return response.data;
    }
  },

  createSportPatterns: async (patternsData) => {
    if (MOCK_API) {
      // Generate new IDs for each pattern
      const newSchedules = patternsData.patterns.map((pattern, index) => {
        const newId = Math.max(...MOCK_SCHEDULES.map(s => s.id)) + index + 1;

        return {
          id: newId,
          sportTypeId: patternsData.sportTypeId,
          startDate: patternsData.startDate,
          endDate: patternsData.endDate,
          createdAt: new Date().toISOString(),
          ...pattern,
        };
      });

      // Add to mock data
      MOCK_SCHEDULES.push(...newSchedules);

      return newSchedules;
    } else {
      const response = await sportApiClient.post('/schedules/sport-patterns', patternsData);
      return response.data;
    }
  },
};

export default sportService;
