import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/auth/Login';
import UnauthorizedPage from './pages/auth/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AlertDialogProvider } from './contexts/AlertDialogContext';
import ErrorHandler from './components/ErrorHandler';
import './App.css';

// Import pages for the admin panel
import Users from './pages/Users';
import Courses from './pages/Courses';
import Semesters from './pages/Semesters';
import Threads from './pages/Threads';
import Assignments from './pages/Assignments';
import Storage from './pages/Storage';
import Logs from './pages/Logs';

// Import pages for the sport service
import Sport from './pages/Sport';
import SportTypes from './pages/Sport/SportTypes';
import Facilities from './pages/Sport/Facilities';
import PhysicalEducation from './pages/Sport/PhysicalEducation';
import Schedules from './pages/Sport/Schedules';

// Import error pages
import {
  NotFound,
  ServerError,
  BadGateway,
  Forbidden,
  ServiceUnavailable
} from './pages/errors';

function App() {
  return (
    <Provider store={store}>
      <AlertDialogProvider>
        <Router>
          <ErrorHandler />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />

              {/* Admin panel routes */}
              <Route path="users" element={<Users />} />
              <Route path="courses" element={<Courses />} />
              <Route path="semesters" element={<Semesters />} />
              <Route path="threads" element={<Threads />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="storage" element={<Storage />} />
              <Route path="logs" element={<Logs />} />

              {/* Sport service routes */}
              <Route path="sport" element={<Sport />} />
              <Route path="sport/types" element={<SportTypes />} />
              <Route path="sport/facilities" element={<Facilities />} />
              <Route path="sport/physical-education" element={<PhysicalEducation />} />
              <Route path="sport/schedules" element={<Schedules />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Error pages */}
          <Route path="/error">
            <Route path="404" element={<NotFound />} />
            <Route path="403" element={<Forbidden />} />
            <Route path="500" element={<ServerError />} />
            <Route path="502" element={<BadGateway />} />
            <Route path="503" element={<ServiceUnavailable />} />
          </Route>
        </Routes>
      </Router>
      </AlertDialogProvider>
    </Provider>
  );
}

export default App;
