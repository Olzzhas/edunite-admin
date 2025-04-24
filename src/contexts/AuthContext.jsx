import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = (userData) => {
    // In a real app, this would make an API call
    // For mock auth, we'll just store the user in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    return Promise.resolve(userData);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    return Promise.resolve();
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
