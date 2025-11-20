import React from 'react';
import StarRating from './StarRating';
import '../styles/AnimeCard.css';

function AnimeCard({ item }) {
  return (
    <div className="anime-card-horizontal">
      <img className="anime-card-image" src={item.imageUrl} alt={item.title} />
      <div className="anime-card-content">
        <h2 className="anime-card-title">{item.title}</h2>
        
        <div className="anime-card-meta">
          <span className="anime-year">{item.releaseYear}</span>
          <span className="anime-genre">{item.genre}</span>
        </div>

        <p className="anime-card-description">{item.description}</p>
        
        <div className="anime-card-bottom-row">
          <div className="anime-rating-container">
            <StarRating rating={item.rating} />
            <span>{item.rating} rating</span>
          </div>
          <button className="save-button">
            Save
            <svg xmlns="http://www.w3.org/2000/svg" className="save-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;