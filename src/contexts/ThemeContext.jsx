import { createContext, useState, useEffect, useContext } from 'react';

// Create a context for theme management
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Check if user has a saved preference
    if (savedTheme) {
      return savedTheme;
    }
    // Always default to light theme, ignoring system preference
    return 'light';
  });

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document when it changes
  useEffect(() => {
    // Set the data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);

    // Also add/remove the 'dark' class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save theme preference
    localStorage.setItem('theme', theme);

    console.log('Theme changed to:', theme);
  }, [theme]);

  // We're not automatically changing theme based on system preference anymore
  // But we'll keep the listener structure in case we want to re-enable this feature later
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only log the change but don't automatically switch theme
      console.log('System preference changed:', mediaQuery.matches ? 'dark' : 'light');
      // Theme will remain as user's explicit choice or default light
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
