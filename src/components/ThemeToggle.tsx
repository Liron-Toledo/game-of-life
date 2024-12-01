import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle component allows the user to toggle between light and dark themes.
 * The theme preference is applied by adding or removing a `dark` class to the 
 * root `<html>` element.
 */
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize state based on `localStorage` or system preference
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      } else {
        // If no preference is stored, use the system's color scheme
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return false; // Default to light theme
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;