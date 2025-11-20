import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home.jsx'; 
import Anime from './pages/Anime.jsx';
import Shows from './pages/Shows.jsx';
import Movies from './pages/Movies.jsx'; 
import Navbar from './components/Navbar';
import Header from './components/Header';


function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;