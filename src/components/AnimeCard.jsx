import React, { useState, useEffect, useCallback, useRef } from 'react';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/AnimeCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function AnimeCard({ item, category }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageUrl, setImageUrl] = useState(item.imageUrl || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const safeCategory = category || 'anime';
  const isSaved = isFavorite(item.id, safeCategory);
  
  const isAdultContent = item.isAdult === 1 || item.isAdult === "1" || item.isAdult === true;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchPosterImage = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/images/details/${item.id}`);
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.posterUrl);
      }
    } catch (error) {
      console.error('Failed to fetch poster:', error);
    }
  }, [item.id]);

  useEffect(() => {
    if (isVisible && !imageUrl && item.id) {
      fetchPosterImage();
    }
  }, [isVisible, imageUrl, item.id, fetchPosterImage]);

  const handleClick = () => {
    navigate(`/details/${safeCategory}/${item.id}`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleFavorite(item, safeCategory);
  };

  const formatVotes = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="anime-card-horizontal" onClick={handleClick} ref={cardRef}>
      <div className="anime-card-image-container">
        {!imageLoaded && (
          <div className="anime-card-placeholder">
            <span>Loading...</span>
          </div>
        )}
        <img 
          className={`anime-card-image ${imageLoaded ? 'loaded' : 'loading'}`}
          src={imageUrl || 'placeholder.png'} 
          alt={item.title}
          loading="lazy"
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>
      <div className="anime-card-content">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
           <h2 className="anime-card-title">{item.title}</h2>
           {isAdultContent && (
             <span style={{
               background:'red', color:'white', fontWeight:'bold', 
               padding:'2px 6px', borderRadius:'4px', fontSize:'0.8rem',
               marginLeft:'10px', flexShrink: 0
             }}>
               18+
             </span>
           )}
        </div>
        
        <div className="anime-card-meta">
          <span className="anime-year">{item.releaseYear}</span>
          <span className="anime-genre">{item.genre}</span>
          {item.runtimeMinutes && (
            <span className="anime-year" style={{marginLeft:'10px'}}>
              ⏱ {item.runtimeMinutes} min
            </span>
          )}
        </div>

        <p className="anime-card-description">{item.description}</p>
        
        <div className="anime-card-bottom-row">
          <div className="anime-rating-container">
            <StarRating rating={item.rating} />
            <span style={{display:'flex', flexDirection:'column', lineHeight:'1.2'}}>
                <span>{item.rating}</span>
                <span style={{fontSize:'0.75rem', color:'#aaa'}}>({formatVotes(item.numVotes)} votes)</span>
            </span>
          </div>
          
          <button className="save-button" onClick={handleSave}>
            {isSaved ? "Saved" : "Save"}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="save-icon" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              fill={isSaved ? "var(--text-primary)" : "none"} 
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;