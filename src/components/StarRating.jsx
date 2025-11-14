import React from 'react';
import '../styles/StarRating.css';

function StarRating({ rating }) {
  const starPercentage = (rating / 10) * 100;
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

  return (
    <div className="stars-outer">
      <div 
        className="stars-inner" 
        style={{ width: starPercentageRounded }}
      >
      </div>
    </div>
  );
}

export default StarRating;