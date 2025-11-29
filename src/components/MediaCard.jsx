import React, { useState } from 'react';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext'; 
import '../styles/MediaCard.css';

function MediaCard({ item, category }) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites(); 

  const safeCategory = category || 'anime';
  const isSaved = isFavorite(item.id, safeCategory);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleMouseMove = (e) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: cardRect.right + 50,
      y: cardRect.top + (cardRect.height / 2)
    });
  };

  const handleClick = () => {
    navigate(`/details/${safeCategory}/${item.id}`);
  };

  return (
    <>
      <div 
        className="media-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <img src={item.imageUrl} alt={item.title} />
        {isSaved && (
           <div style={{position: 'absolute', top: '5px', right: '5px', color: '#b3004a'}}>
             ★
           </div>
        )}
      </div>

      {isHovering && (
        <div 
          className="media-popover"
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="popover-rating">
            <StarRating rating={item.rating} />
            <span>{item.rating} rating</span>
          </div>
          <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#b3004a', fontWeight: 'bold'}}>
            {isSaved ? "Already in your Saved list" : ""}
          </div>
        </div>
      )}
    </>
  );
}

export default MediaCard;