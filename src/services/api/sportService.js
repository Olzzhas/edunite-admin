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
const MOCK_API = false;

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
      try {
        console.log('Fetching sport types with params:', { page, page_size: size });
        const response = await sportApiClient.get('/sport-types', { params: { page, page_size: size } });
        console.log('Sport types API response:', response.data);

        // Transform the API response to match our expected format
        return {
          data: response.data.sport_types || [],
          meta: {
            total: response.data.total || 0,
            page: response.data.page || 1,
            page_size: response.data.page_size || size,
            total_pages: Math.ceil((response.data.total || 0) / (response.data.page_size || size))
          }
        };
      } catch (error) {
        console.error('Error fetching sport types:', error);
        throw error;
      }
    }
  },

  getSportTypeById: async (id) => {
    if (MOCK_API) {
      const sportType = MOCK_SPORT_TYPES.find(st => st.id === parseInt(id));
      if (!sportType) throw new Error('Sport type not found');
      return sportType;
    } else {
      try {
        console.log(`Fetching sport type with ID: ${id}`);
        const response = await sportApiClient.get(`/sport-types/${id}`);
        console.log('Sport type API response:', response.data);

        // The API might return the sport type directly or nested in a sport_type field
        const sportType = response.data.sport_type || response.data;
        return sportType;
      } catch (error) {
        console.error(`Error fetching sport type with ID ${id}:`, error);
        throw error;
      }
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
      try {
        console.log('Creating sport type with data:', sportTypeData);
        const response = await sportApiClient.post('/sport-types', sportTypeData);
        console.log('Create sport type API response:', response.data);

        // The API might return the created sport type directly or nested in a sport_type field
        const createdSportType = response.data.sport_type || response.data;
        return createdSportType;
      } catch (error) {
        console.error('Error creating sport type:', error);
        throw error;
      }
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
      try {
        console.log(`Updating sport type with ID ${id} with data:`, sportTypeData);
        const response = await sportApiClient.put(`/sport-types/${id}`, sportTypeData);
        console.log('Update sport type API response:', response.data);

        // The API might return the updated sport type directly or nested in a sport_type field
        const updatedSportType = response.data.sport_type || response.data;
        return updatedSportType;
      } catch (error) {
        console.error(`Error updating sport type with ID ${id}:`, error);
        throw error;
      }
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
      try {
        console.log(`Deleting sport type with ID: ${id}`);
        const response = await sportApiClient.delete(`/sport-types/${id}`);
        console.log('Delete sport type API response:', response.data);

        // Return the ID for consistency with the reducer
        return id;
      } catch (error) {
        console.error(`Error deleting sport type with ID ${id}:`, error);
        throw error;
      }
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
      try {
        console.log('Fetching facilities with params:', { page, page_size: size });
        const response = await sportApiClient.get('/facilities', { params: { page, page_size: size } });
        console.log('Facilities API response:', response.data);

        // Transform the API response to match our expected format
        return {
          data: response.data.facilities || [],
          meta: {
            total: response.data.total || 0,
            page: response.data.page || 1,
            page_size: response.data.page_size || size,
            total_pages: Math.ceil((response.data.total || 0) / (response.data.page_size || size))
          }
        };
      } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
      }
    }
  },

  getFacilityById: async (id) => {
    if (MOCK_API) {
      const facility = MOCK_FACILITIES.find(f => f.id === parseInt(id));
      if (!facility) throw new Error('Facility not found');
      return facility;
    } else {
      try {
        console.log(`Fetching facility with ID: ${id}`);
        const response = await sportApiClient.get(`/facilities/${id}`);
        console.log('Facility API response:', response.data);

        // The API might return the facility directly or nested in a facility field
        const facility = response.data.facility || response.data;
        return facility;
      } catch (error) {
        console.error(`Error fetching facility with ID ${id}:`, error);
        throw error;
      }
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
      try {
        // Transform data to match API expectations
        const apiData = {
          title: facilityData.name || facilityData.title,
          location: facilityData.location,
          max_capacity: facilityData.capacity || facilityData.max_capacity,
          description: facilityData.description
        };

        console.log('Creating facility with data:', apiData);
        const response = await sportApiClient.post('/facilities', apiData);
        console.log('Create facility API response:', response.data);

        // The API might return the created facility directly or nested in a facility field
        const createdFacility = response.data.facility || response.data;
        return createdFacility;
      } catch (error) {
        console.error('Error creating facility:', error);
        throw error;
      }
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
      try {
        // Transform data to match API expectations
        const apiData = {
          title: facilityData.name || facilityData.title,
          location: facilityData.location,
          max_capacity: facilityData.capacity || facilityData.max_capacity,
          description: facilityData.description
        };

        console.log(`Updating facility with ID ${id} with data:`, apiData);
        const response = await sportApiClient.put(`/facilities/${id}`, apiData);
        console.log('Update facility API response:', response.data);

        // The API might return the updated facility directly or nested in a facility field
        const updatedFacility = response.data.facility || response.data;
        return updatedFacility;
      } catch (error) {
        console.error(`Error updating facility with ID ${id}:`, error);
        throw error;
      }
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
      try {
        console.log(`Deleting facility with ID: ${id}`);
        const response = await sportApiClient.delete(`/facilities/${id}`);
        console.log('Delete facility API response:', response.data);

        // Return the ID for consistency with the reducer
        return id;
      } catch (error) {
        console.error(`Error deleting facility with ID ${id}:`, error);
        throw error;
      }
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

  getFilteredSchedules: async (filters = {}) => {
    const {
      facility_id,
      teacher_id,
      semester_id,
      start_date,
      end_date,
      page = 1,
      page_size = 20
    } = filters;

    if (MOCK_API) {
      // Filter mock schedules based on provided filters
      let filteredSchedules = [...MOCK_SCHEDULES];

      if (facility_id) {
        filteredSchedules = filteredSchedules.filter(s => s.facilityId === parseInt(facility_id));
      }

      if (teacher_id) {
        filteredSchedules = filteredSchedules.filter(s => s.teacherId === parseInt(teacher_id));
      }

      if (semester_id) {
        // In a real app, schedules would be linked to semesters
        // For mock data, we'll just pretend all schedules are in the given semester
      }

      if (start_date) {
        const startDateObj = new Date(start_date);
        filteredSchedules = filteredSchedules.filter(s => new Date(s.startDate) >= startDateObj);
      }

      if (end_date) {
        const endDateObj = new Date(end_date);
        filteredSchedules = filteredSchedules.filter(s => new Date(s.endDate) <= endDateObj);
      }

      // Paginate results
      const startIndex = (page - 1) * page_size;
      const endIndex = startIndex + page_size;
      const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

      return {
        data: paginatedSchedules,
        meta: {
          total: filteredSchedules.length,
          page,
          page_size,
          total_pages: Math.ceil(filteredSchedules.length / page_size)
        }
      };
    } else {
      try {
        // Build query parameters
        const params = { page, page_size };

        if (facility_id) params.facility_id = facility_id;
        if (teacher_id) params.teacher_id = teacher_id;
        if (semester_id) params.semester_id = semester_id;
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;

        console.log('Fetching schedules with params:', params);
        const response = await sportApiClient.get('/schedules', { params });
        console.log('API response:', response.data);

        // Transform the API response to match our expected format
        return {
          data: response.data.schedules || [],
          meta: {
            total: response.data.total || 0,
            page: response.data.page || 1,
            page_size: response.data.page_size || 20,
            total_pages: Math.ceil((response.data.total || 0) / (response.data.page_size || 20))
          }
        };
      } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }
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
      // Transform data to match API expectations
      const apiData = {
        facility_id: parseInt(scheduleData.facilityId),
        teacher_id: parseInt(scheduleData.teacherId),
        semester_id: parseInt(scheduleData.semesterId),
        sport_type_id: parseInt(scheduleData.sportTypeId),
        day_of_week: parseInt(scheduleData.dayOfWeek),
        start_time: scheduleData.startTime,
        end_time: scheduleData.endTime,
        location: scheduleData.location,
        start_date: scheduleData.startDate,
        end_date: scheduleData.endDate
      };

      console.log('Creating weekly schedule with data:', apiData);
      const response = await sportApiClient.post('/schedules/weekly', apiData);
      console.log('Create weekly schedule API response:', response.data);
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
      // Transform data to match API expectations
      const apiData = {
        semester_id: parseInt(patternsData.semesterId),
        start_date: patternsData.startDate,
        end_date: patternsData.endDate,
        patterns: patternsData.patterns.map(pattern => ({
          sport_type_id: parseInt(patternsData.sportTypeId),
          schedules: pattern.schedules.map(schedule => ({
            facility_id: parseInt(schedule.facilityId),
            teacher_id: parseInt(schedule.teacherId),
            day_of_week: parseInt(schedule.dayOfWeek),
            start_time: schedule.startTime,
            end_time: schedule.endTime,
            location: schedule.location
          }))
        }))
      };

      console.log('Creating sport patterns with data:', apiData);
      const response = await sportApiClient.post('/schedules/sport-patterns', apiData);
      console.log('Create sport patterns API response:', response.data);
      return response.data;
    }
  },
};

export default sportService;
