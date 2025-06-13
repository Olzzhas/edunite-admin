import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Notifications from '../Notifications';
import notificationReducer from '../../store/slices/notificationSlice';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock the notification service
jest.mock('../../services/api', () => ({
  notificationService: {
    getEmailTemplates: jest.fn().mockResolvedValue([
      { name: 'default_notification', subject: 'Notification' },
      { name: 'announcement', subject: 'Important Announcement' },
    ]),
    getUsers: jest.fn().mockResolvedValue({ users: [] }),
    getDegrees: jest.fn().mockResolvedValue({ degrees: [] }),
    getCourses: jest.fn().mockResolvedValue({ courses: [] }),
    getThreads: jest.fn().mockResolvedValue({ threads: [] }),
  },
}));

// Mock date utils
jest.mock('../../utils/dateUtils', () => ({
  formatTimestamp: jest.fn((date) => new Date(date).toLocaleDateString()),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      notifications: notificationReducer,
    },
    preloadedState: {
      notifications: {
        notifications: [],
        userNotifications: [],
        stats: null,
        totalCount: 0,
        unreadCount: 0,
        loading: false,
        creating: false,
        error: null,
        success: false,
        message: '',
        ...initialState.notifications,
      },
    },
  });
};

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          {component}
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Notifications Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders notification form by default', () => {
    renderWithProviders(<Notifications />);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Send Notification')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test('switches between tabs', () => {
    renderWithProviders(<Notifications />);
    
    // Initially on create tab
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    
    // Switch to list tab
    fireEvent.click(screen.getByText('Sent Notifications'));
    expect(screen.getByText('No notifications sent yet')).toBeInTheDocument();
    
    // Switch back to create tab
    fireEvent.click(screen.getByText('Send Notification'));
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<Notifications />);
    
    const submitButton = screen.getByRole('button', { name: /send notification/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  test('shows target selection options', () => {
    renderWithProviders(<Notifications />);
    
    expect(screen.getByText('All Users')).toBeInTheDocument();
    expect(screen.getByText('By Role')).toBeInTheDocument();
    expect(screen.getByText('Specific User')).toBeInTheDocument();
    expect(screen.getByText('By Degree')).toBeInTheDocument();
    expect(screen.getByText('By Course')).toBeInTheDocument();
    expect(screen.getByText('By Thread')).toBeInTheDocument();
  });

  test('shows email options when checkbox is checked', () => {
    renderWithProviders(<Notifications />);
    
    const emailCheckbox = screen.getByLabelText(/send email notification/i);
    fireEvent.click(emailCheckbox);
    
    expect(screen.getByLabelText(/email subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email template/i)).toBeInTheDocument();
  });

  test('displays notification types and priorities', () => {
    renderWithProviders(<Notifications />);
    
    const typeSelect = screen.getByLabelText(/type/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    
    expect(typeSelect).toBeInTheDocument();
    expect(prioritySelect).toBeInTheDocument();
  });

  test('shows sent notifications list when data is available', () => {
    const mockNotifications = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'Test message',
        type: 'info',
        priority: 'normal',
        target_type: 'all',
        target_value: '',
        created_at: '2024-01-01T00:00:00Z',
        sent_at: '2024-01-01T00:01:00Z',
      },
    ];

    renderWithProviders(<Notifications />, {
      initialState: {
        notifications: {
          notifications: mockNotifications,
          totalCount: 1,
          loading: false,
        },
      },
    });
    
    // Switch to list tab
    fireEvent.click(screen.getByText('Sent Notifications'));
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('normal')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    renderWithProviders(<Notifications />, {
      initialState: {
        notifications: {
          loading: true,
        },
      },
    });
    
    // Switch to list tab
    fireEvent.click(screen.getByText('Sent Notifications'));
    
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Loading spinner
  });

  test('shows error state', () => {
    renderWithProviders(<Notifications />, {
      initialState: {
        notifications: {
          error: 'Failed to load notifications',
        },
      },
    });
    
    expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    renderWithProviders(<Notifications />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    
    expect(titleInput.value).toBe('Test Title');
    expect(messageInput.value).toBe('Test Message');
  });

  test('handles target type selection', () => {
    renderWithProviders(<Notifications />);
    
    const roleOption = screen.getByText('By Role');
    fireEvent.click(roleOption);
    
    // Should show the role option as selected (visual feedback)
    expect(roleOption.closest('div')).toHaveClass('border-primary-500');
  });
});
