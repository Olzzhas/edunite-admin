import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/auth/Login';
import UnauthorizedPage from './pages/auth/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Import pages for the admin panel
import Users from './pages/Users';
import Courses from './pages/Courses';
import Semesters from './pages/Semesters';
import Threads from './pages/Threads';
import Assignments from './pages/Assignments';
import Storage from './pages/Storage';

function App() {
  return (
    <Provider store={store}>
      <Router>
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

              {/* Catch-all route */}
              <Route path="*" element={<div className="p-6">Page not found</div>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
