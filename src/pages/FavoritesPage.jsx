import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import AnimeCard from '../components/AnimeCard';
import { useLoading } from '../context/LoadingProvider';
import '../styles/AnimePage.css'; 
import '../styles/FavoritesPage.css';

function FavoritesPage() {
  const { favorites } = useFavorites();
  const { stopLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  const filteredFavorites = favorites.filter(item => {
    if (activeTab === 'all') return true;
    return item.category && item.category.toLowerCase() === activeTab;
  });

  return (
    <div className="favorites-container"> 
      <h1 className="favorites-header">My Saved List</h1>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`tab-btn ${activeTab === 'anime' ? 'active' : ''}`}
          onClick={() => setActiveTab('anime')}
        >
          Anime
        </button>
        <button 
          className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button 
          className={`tab-btn ${activeTab === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveTab('shows')}
        >
          Shows
        </button>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="empty-state">
          {activeTab === 'all' 
            ? "You haven't saved anything yet. Go explore!" 
            : `No saved ${activeTab} found.`}
        </div>
      ) : (
        <div className="anime-list-container">
          {filteredFavorites.map((item) => (
            <AnimeCard 
              key={`${item.category}-${item.id}`} 
              item={item} 
              category={item.category} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;