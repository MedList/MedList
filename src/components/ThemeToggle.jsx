import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css'; 

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-wrapper">
      <input 
        type="checkbox" 
        className="theme-checkbox" 
        id="theme-toggle" 
        checked={theme === 'light'}
        onChange={toggleTheme}
      />
      <label className="theme-label" htmlFor="theme-toggle">
        <span className="theme-icon moon">🌙</span>
        <span className="theme-icon sun">☀️</span>
        <div className="theme-ball"></div>
      </label>
    </div>
  );
};

export default ThemeToggle;