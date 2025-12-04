import React from 'react';
import '../styles/Header.css';
import ThemeToggle from './ThemeToggle'; 

function Header() {
  return (
    <header className="header-container">
      <div className="theme-toggle-corner">
        <ThemeToggle />
      </div>

      <div className="header-title-container">
        <h1 className="header-title">MedList</h1>
        <img className="header-title-logo" src="./vite.svg" alt="MedList logo"/>
      </div>
      
      <div className="header-ad-container">
        <img className="header-ad" src="./unnamed.jpg" alt="Advertisement"/> 
      </div>
    </header>
  );
}

export default Header;