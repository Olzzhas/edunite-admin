import apiClient from './apiClient';

// Mock data for development
const MOCK_LOCATIONS = [
  {
    id: 1,
    name: 'Room 101',
    description: 'Main lecture hall',
    capacity: 50,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Room 102',
    description: 'Small classroom',
    capacity: 25,
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Room 201',
    description: 'Computer lab',
    capacity: 30,
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z',
  },
  {
    id: 4,
    name: 'Room 202',
    description: 'Science lab',
    capacity: 20,
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z',
  },
  {
    id: 5,
    name: 'Auditorium',
    description: 'Large event space',
    capacity: 200,
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z',
  },
];

// Use real API data
const MOCK_API = false;

const locationService = {
  getLocations: async (page = 1, size = 10) => {
    if (MOCK_API) {
      // Paginate
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedLocations = MOCK_LOCATIONS.slice(start, end);

      return {
        data: paginatedLocations,
        meta: {
          total: MOCK_LOCATIONS.length,
          page,
          page_size: size
        }
      };
    } else {
      try {
        console.log('Fetching locations with page:', page, 'size:', size);
        const response = await apiClient.get('/locations', {
          params: { page, page_size: size }
        });
        console.log('Locations API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
    }
  },

  getLocationById: async (id) => {
    if (MOCK_API) {
      const location = MOCK_LOCATIONS.find(l => l.id === parseInt(id));
      if (!location) throw new Error('Location not found');
      return location;
    } else {
      try {
        console.log(`Fetching location with ID: ${id}`);
        const response = await apiClient.get(`/locations/${id}`);
        console.log('Location API response:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Error fetching location with ID ${id}:`, error);
        throw error;
      }
    }
  },

  createLocation: async (locationData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_LOCATIONS.map(l => l.id)) + 1;

      // Create new location
      const newLocation = {
        id: newId,
        name: locationData.name,
        description: locationData.description,
        capacity: parseInt(locationData.capacity),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data
      MOCK_LOCATIONS.push(newLocation);

      return newLocation;
    } else {
      try {
        console.log('Creating location with data:', locationData);
        const response = await apiClient.post('/locations', locationData);
        console.log('Create location API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating location:', error);
        throw error;
      }
    }
  },

  updateLocation: async (id, locationData) => {
    if (MOCK_API) {
      const index = MOCK_LOCATIONS.findIndex(l => l.id === parseInt(id));
      if (index === -1) throw new Error('Location not found');

      // Update location
      const updatedLocation = {
        ...MOCK_LOCATIONS[index],
        name: locationData.name,
        description: locationData.description,
        capacity: parseInt(locationData.capacity),
        updated_at: new Date().toISOString(),
      };

      // Update in mock data
      MOCK_LOCATIONS[index] = updatedLocation;

      return updatedLocation;
    } else {
      try {
        console.log(`Updating location with ID ${id} with data:`, locationData);
        const response = await apiClient.put(`/locations/${id}`, locationData);
        console.log('Update location API response:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Error updating location with ID ${id}:`, error);
        throw error;
      }
    }
  },

  deleteLocation: async (id) => {
    if (MOCK_API) {
      const index = MOCK_LOCATIONS.findIndex(l => l.id === parseInt(id));
      if (index === -1) throw new Error('Location not found');

      // Remove from mock data
      MOCK_LOCATIONS.splice(index, 1);

      return { success: true };
    } else {
      try {
        console.log(`Deleting location with ID: ${id}`);
        const response = await apiClient.delete(`/locations/${id}`);
        console.log('Delete location API response:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Error deleting location with ID ${id}:`, error);
        throw error;
      }
    }
  },

  checkLocationAvailability: async (availabilityData) => {
    if (MOCK_API) {
      // In mock mode, always return available
      return { available: true };
    } else {
      try {
        console.log('Checking location availability with data:', availabilityData);
        const response = await apiClient.post('/locations/check-availability', availabilityData);
        console.log('Check location availability API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error checking location availability:', error);
        throw error;
      }
    }
  }
};

export default locationService;
