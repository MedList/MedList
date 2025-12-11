import React from 'react';
import '../styles/Header.css';
import ThemeToggle from './ThemeToggle'; 
import ColorThemeSelector from './ColorThemeSelector'; 

import logo from '/backdrop1.svg'; 
import ad from '/unnamed.jpg'; 

function Header() {
  return (
    <header className="header-container">
      <div className="theme-toggle-corner" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ColorThemeSelector />
        <ThemeToggle />
      </div>

      <div className="header-title-container">
        <h1 className="header-title">MedList</h1>
        <img className="header-title-logo" src={logo} alt="MedList logo"/>
      </div>
      
      <div className="header-ad-container">
        <img className="header-ad" src={ad} alt="Advertisement"/> 
      </div>
    </header>
  );
}

export default Header;