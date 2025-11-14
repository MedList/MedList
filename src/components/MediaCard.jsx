import React, { useState } from 'react';
import StarRating from './StarRating'; 
import '../styles/MediaCard.css';

function MediaCard({ item }) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e) => {

    const cardRect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: cardRect.right + 50, 
      y: cardRect.top + (cardRect.height / 2) 
    });
  };

  return (
    <>
      <div 
        className="media-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove} 
      >
        <img src={item.imageUrl} alt={item.title} />
      </div>

      {isHovering && (
        <div 
          className="media-popover"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="popover-rating">
            <StarRating rating={item.rating} />
            <span>{item.rating} rating</span>
          </div>
        </div>
      )}
    </>
  );
}

export default MediaCard;