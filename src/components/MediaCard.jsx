import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/MediaCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function MediaCard({ item, category }) {
  const [coords, setCoords] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [posterUrl, setPosterUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites(); 

  const safeCategory = category || 'anime';
  const isSaved = isFavorite(item.id, safeCategory);

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

  // Fetch poster when card becomes visible
  const fetchPoster = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/images/details/${item.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.posterUrl) {
          setPosterUrl(data.posterUrl);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch poster:', error);
      setIsLoading(false);
    }
  }, [item.id]);

  useEffect(() => {
    if (isVisible && !posterUrl && item.id) {
      fetchPoster();
    }
  }, [isVisible, posterUrl, item.id, fetchPoster]);

  const handleClick = () => {
    navigate(`/details/${safeCategory}/${item.id}`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleFavorite(item, safeCategory);
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const popupWidth = 360; 
      const windowWidth = window.innerWidth;

      const fitsRight = rect.right + popupWidth < windowWidth;

      if (fitsRight) {
        setCoords({
          top: rect.top + (rect.height / 2), 
          left: rect.right + 10 
        });
        setIsFlipped(false);
      } else {
        setCoords({
          top: rect.top + (rect.height / 2),
          left: rect.left - 10 
        });
        setIsFlipped(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setCoords(null); 
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  const popupContent = coords && (
    <div 
      className={`media-popover ${isFlipped ? 'flipped' : ''}`}
      style={{ 
        position: 'fixed',
        top: `${coords.top}px`, 
        left: `${coords.left}px`,
        transform: isFlipped ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
      }}
    >
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      
      <div className="popover-rating">
        <StarRating rating={item.rating} />
        <span>{item.rating} rating</span>
      </div>
      
      {isSaved && <div className="saved-status">★ Saved</div>}
    </div>
  );

  return (
    <>
      <div 
        className="media-card"
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Loading placeholder */}
        {isLoading && (
          <div className="media-card-placeholder">
            <span>Loading...</span>
          </div>
        )}

        {/* Poster image */}
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt={item.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
        
        {/* Mobile info overlay */}
        <div className="media-mobile-info">
          <h3 className="mobile-title">{item.title}</h3>
          <div className="mobile-meta">
             <span className="mobile-rating">★ {item.rating}</span>
             {isSaved && <span className="mobile-saved">Saved</span>}
          </div>
        </div>

        {/* Save button */}
        <button 
          className={`media-save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          title={isSaved ? 'Remove from saved' : 'Add to saved'}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>

      {coords && createPortal(popupContent, document.body)}
    </>
  );
}

export default MediaCard;