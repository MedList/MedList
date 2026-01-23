import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard'; 
import StarRating from '../components/StarRating';
import { useFavorites } from '../context/FavoritesContext';
import { useLoading } from '../context/LoadingProvider';
import '../styles/DetailsPage.css';

// Use the API URL .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DetailsPage = () => {
  const { category, id } = useParams(); // id = 'tconst'
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { stopLoading } = useLoading();
  
  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [tmdbDetails, setTmdbDetails] = useState(null);
  const [error, setError] = useState(null);

  const safeCategory = category || 'anime';
  const isSaved = item ? isFavorite(item.tconst, safeCategory) : false;

  useEffect(() => {
    fetchItemDetails();
  }, [id, category]);

  const fetchItemDetails = async () => {
    try {
      const endpoint = `${API_URL}/${safeCategory}/${id}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Item not found');
      }

      const foundItem = await response.json();
      setItem(foundItem);
      setError(null);

      fetchTmdbDetails(foundItem.tconst);
      fetchRecommendations(foundItem);
      stopLoading();
    } catch (err) {
      console.error('Failed to fetch details:', err);
      setError('Failed to load item details');
      stopLoading();
    }

    window.scrollTo(0, 0);
  };

  const fetchTmdbDetails = async (tconst) => {
    try {
      const response = await fetch(`${API_URL}/images/details/${tconst}`);
      if (response.ok) {
        const data = await response.json();
        setTmdbDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch TMDB details:', error);
    }
  };

  const fetchRecommendations = async (foundItem) => {
    try {
      const genre = encodeURIComponent(foundItem.genres || '');
      const endpoint = `${API_URL}/${safeCategory}/search?genre=${genre}&minYear=${foundItem.startYear - 2}&maxYear=${foundItem.startYear + 2}&minRating=7`;
      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();
        const filtered = (data.data || [])
          .filter(item => item.tconst !== foundItem.tconst)
          .slice(0, 4);
        setRecommendations(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (item) {
      toggleFavorite(
        {
          id: item.tconst,
          title: item.primaryTitle,
          genre: item.genres,
          releaseYear: item.startYear,
          rating: item.averageRating,
          numVotes: item.numVotes,
          isAdult: item.isAdult,
          imageUrl: tmdbDetails?.posterUrl,
          description: item.titleType
        },
        safeCategory
      );
    }
  };

  const handleWatchTrailer = () => {
    if (tmdbDetails?.trailerUrl) {
      window.open(tmdbDetails.trailerUrl, '_blank');
    }
  };

  if (error) return <div className="details-container"><h2 style={{color: 'red'}}>{error}</h2></div>;
  if (!item) return <div className="details-container"><h2>Loading...</h2></div>;

  return (
    <div className="details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="details-content">
        <img 
          className="details-image" 
          src={tmdbDetails?.posterUrl || 'placeholder.png'} 
          alt={item.primaryTitle} 
        />
        
        <div className="details-info">
          <h1 className="details-title">{item.primaryTitle}</h1>
          
          <div className="details-meta">
            <span className="meta-pill">{item.genres}</span>
            <span className="meta-year">{item.startYear}</span>
            {item.endYear && item.endYear !== '\\N' && (
              <span className="meta-year">- {item.endYear}</span>
            )}
          </div>

          <div className="details-rating">
            <StarRating rating={item.averageRating} />
            <span>{item.averageRating}/10</span>
            <span style={{fontSize: '0.9rem', color: '#aaa', marginLeft: '10px'}}>
              ({item.numVotes?.toLocaleString() || '0'} votes)
            </span>
          </div>

          <p className="details-description">
            {tmdbDetails?.overview || item.titleType}
          </p>

          <div className="action-buttons">
            <button 
              className={`action-btn btn-primary ${!tmdbDetails?.trailerUrl ? 'disabled' : ''}`}
              onClick={handleWatchTrailer}
              disabled={!tmdbDetails?.trailerUrl}
              title={tmdbDetails?.trailerUrl ? 'Watch trailer on YouTube' : 'No trailer available'}
            >
              {tmdbDetails?.trailerUrl ? '▶ Watch Trailer' : 'No Trailer'}
            </button>
            <button 
              className="action-btn btn-secondary"
              onClick={handleSave}
              title={isSaved ? 'Remove from saved' : 'Add to saved'}
            >
              {isSaved ? 'Saved' : 'Add to Saved'}
            </button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-container">
          <h2 className="recommendations-title">You Might Also Like</h2>
          <div className="recommendations-grid">
            {recommendations.map((recItem) => (
              <MediaCard 
                key={recItem.tconst} 
                item={{
                  id: recItem.tconst,
                  title: recItem.primaryTitle,
                  genre: recItem.genres,
                  releaseYear: recItem.startYear,
                  rating: recItem.averageRating,
                  numVotes: recItem.numVotes,
                  imageUrl: recItem.imdb_url,
                  description: recItem.titleType
                }}
                category={safeCategory} 
              />
            ))}
          </div>
        </div>
      )}
      
      {recommendations.length === 0 && (
        <div className="recommendations-container">
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            No similar titles found.
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;