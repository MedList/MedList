import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animeData, movieData, showData } from '../data';
import StarRating from '../components/StarRating';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/DetailsPage.css';

function DetailsPage() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  const { toggleFavorite, isFavorite } = useFavorites();

  let dataSet;
  const cleanCategory = category ? category.toLowerCase() : '';

  if (cleanCategory === 'anime') dataSet = animeData;
  else if (cleanCategory === 'movies') dataSet = movieData;
  else if (cleanCategory === 'shows') dataSet = showData;
  else dataSet = [];

  const item = dataSet.find(i => i.id === parseInt(id));

  const isSaved = item ? isFavorite(item.id, cleanCategory) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSave = () => {
    toggleFavorite(item, cleanCategory);
  };

  const formatVotes = (num) => {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  if (!item) return <h2 style={{color:'var(--text-primary)', textAlign:'center', marginTop:'50px'}}>Item not found</h2>;

  return (
    <div className="details-container">
      
      <div className="details-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="details-content">
        <img src={item.imageUrl} alt={item.title} className="details-image" />
        
        <div className="details-info">
          <h1 className="details-title">{item.title}</h1>
          
          <div className="details-meta">
            <span className="meta-pill">{item.genre}</span>
            <span className="meta-year">{item.releaseYear}</span>
            
            {item.runtimeMinutes && (
               <span className="meta-year">⏱ {item.runtimeMinutes} min</span>
            )}

            {item.isAdult === 1 && (
               <span style={{
                 backgroundColor: 'red', 
                 color: 'white', 
                 padding: '4px 8px', 
                 borderRadius: '4px', 
                 fontWeight: 'bold',
                 fontSize: '1rem',
                 marginLeft: '10px'
               }}>
                 18+
               </span>
            )}
          </div>

          <div className="details-rating">
            <div style={{ transform: 'scale(1.5)', transformOrigin: 'left center' }}>
              <StarRating rating={item.rating} />
            </div>
            
            <div style={{ marginLeft: '60px', display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span>{item.rating} / 10</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                    ({formatVotes(item.numVotes)} votes)
                </span>
            </div>
          </div>

          <p className="details-description">
            {item.description}
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          {item.directors && item.directors.length > 0 && (
            <div style={{ marginBottom: '30px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Director: </span>
                {item.directors.join(', ')}
            </div>
          )}

          <div className="action-buttons">
            <button 
              className={`action-btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSave}
            >
              {isSaved ? "✓ Saved to List" : "Save to List"}
            </button>
            
            <button className="action-btn btn-secondary">Watch Trailer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;