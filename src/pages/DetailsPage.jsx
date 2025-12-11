import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard'; 
import StarRating from '../components/StarRating';
import '../styles/DetailsPage.css';

import { animeData, movieData, showData } from '../data'; 

const DetailsPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const getAllItems = () => {
    switch (category) {
      case 'movies': return movieData;
      case 'shows': return showData;
      case 'anime': 
      default: return animeData;
    }
  };

  const allItems = getAllItems();

  useEffect(() => {
    const foundItem = allItems.find((i) => i.id.toString() === id);
    
    if (foundItem) {
      setItem(foundItem);
      
      const currentRating = Number(foundItem.rating);

      const recs = allItems
        .filter(media => {
          const mediaRating = Number(media.rating);
          
          return (
            media.genre === foundItem.genre &&         
            media.id !== foundItem.id &&               
            mediaRating >= (currentRating - 2)
          );
        })
        .sort((a, b) => Number(b.rating) - Number(a.rating)) 
        .slice(0, 4); 
      setRecommendations(recs);
    }
    
    window.scrollTo(0, 0);
  }, [id, category, allItems]);

  if (!item) return <div className="details-container">Loading...</div>;

  return (
    <div className="details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="details-content">
        <img className="details-image" src={item.imageUrl} alt={item.title} />
        
        <div className="details-info">
          <h1 className="details-title">{item.title}</h1>
          
          <div className="details-meta">
            <span className="meta-pill">{item.genre}</span>
            <span className="meta-year">{item.releaseYear}</span>
          </div>

          <div className="details-rating">
            <StarRating rating={item.rating} />
            <span>{item.rating}/10</span>
          </div>

          <p className="details-description">{item.description}</p>

          <div className="action-buttons">
            <button className="action-btn btn-primary">Watch Trailer</button>
            <button className="action-btn btn-secondary">Add to Saved</button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-container">
          <h2 className="recommendations-title">You Might Also Like</h2>
          <div className="recommendations-grid">
            {recommendations.map((recItem) => (
              <MediaCard 
                key={recItem.id} 
                item={recItem} 
                category={category || 'anime'} 
              />
            ))}
          </div>
        </div>
      )}
      
      {recommendations.length === 0 && (
        <div className="recommendations-container">
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            No similar titles found (rated higher than {currentRating - 2}).
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;