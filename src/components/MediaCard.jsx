import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/MediaCard.css';

function MediaCard({ item, category }) {
  const [coords, setCoords] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites(); 

  const safeCategory = category || 'anime';
  const isSaved = isFavorite(item.id, safeCategory);

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
        <img src={item.imageUrl} alt={item.title} />
        
        <div className="media-mobile-info">
          <h3 className="mobile-title">{item.title}</h3>
          <div className="mobile-meta">
             <span className="mobile-rating">★ {item.rating}</span>
             {isSaved && <span className="mobile-saved">Saved</span>}
          </div>
        </div>

        <button 
          className="media-save-btn"
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