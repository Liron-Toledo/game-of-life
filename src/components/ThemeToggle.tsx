import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle component allows the user to toggle between light and dark themes.
 * The theme preference is applied by adding or removing a `dark` class to the 
 * root `<html>` element.
 */
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;