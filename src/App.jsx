import React from "react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <body>
        <header class="home-header">
          <div class="home-header-title-container">
            <h1 class="home-header-title">MedList</h1>
            <img class="home-header-title-logo" src="public\vite.svg" alt="Description of the image"/>
          </div>
          <div class="home-header-ad-container">
            <img class="home-header-ad" src="public\unnamed.jpg" alt="Description of the image"/> 
          </div>
        </header>
        <div class="home-navigation">
          <Navbar />
        </div>
        <div class="home-anime-section">
           
        </div>
      </body>
    </>
  );
}
