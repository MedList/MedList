import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/Home.jsx'; 
import Anime from './pages/Anime.jsx';
import Movies from './pages/Movies.jsx';
import Shows from './pages/Shows.jsx'; 
import DetailsPage from './pages/DetailsPage.jsx'; 
import FavoritesPage from './pages/FavoritesPage.jsx'; 

import Navbar from './components/Navbar';
import Header from './components/Header';
import Loader from './components/Loader';
import { useLoading } from './context/LoadingProvider';

function App() {
  const { isLoading, startLoading } = useLoading();
  const location = useLocation(); 

  useEffect(() => {
    startLoading();
  }, [location]); 

  return (
    <div className="app-wrapper">
      <Header />
      <Navbar />
      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/details/:category/:id" element={<DetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;