import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ColorThemeSelector.css';

const ColorThemeSelector = () => {
  const { colorTheme, changeColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: 'sunset', color: '#ad0013' },
    { id: 'ocean', color: '#0ea5e9' },
    { id: 'forest', color: '#10b981' },
    { id: 'royal', color: '#d4af37' },
    { id: 'amethyst', color: '#9333ea' },
    { id: 'neon', color: '#ccff00' },
    { id: 'rose', color: '#ec4899' },
    { id: 'steel', color: '#9ca3af' },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="color-selector-container" ref={dropdownRef}>
      <button 
        className="palette-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Change Color Theme"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
           <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="color-dropdown">
           <div className="color-grid-dropdown">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  changeColorTheme(t.id);
                  setIsOpen(false);
                }}
                className={`color-dot-small ${colorTheme === t.id ? 'active' : ''}`}
                style={{ backgroundColor: t.color }}
                title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorThemeSelector;