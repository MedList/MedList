import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard'; 
import StarRating from '../components/StarRating';
import '../styles/DetailsPage.css';

// Use the API URL .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DetailsPage = () => {
  const { category, id } = useParams(); // id = 'tconst'
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${category}/${id}`);
        const data = await response.json();

        if (data) {
          const mappedItem = {
            id: data.tconst,
            title: data.primaryTitle,
            genre: data.genres,
            releaseYear: data.startYear,
            rating: data.averageRating,
            description: data.titleType,
            imageUrl: data.imdbUrl
          };
          setItem(mappedItem);

          const recResponse = await fetch(`${API_URL}/${category}/search?genre=${data.genres}&minRating=${data.averageRating - 2}`);
          const recData = await recResponse.json();
          
          const filteredRecs = (recData.data || [])
            .filter(r => r.tconst !== id)
            .slice(0, 4)
            .map(r => ({
              id: r.tconst,
              title: r.primaryTitle,
              imageUrl: r.imdb_url,
              rating: r.averageRating
            }));

          setRecommendations(filteredRecs);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, category]);

  if (loading) return <div className="details-container">Loading details from AWS...</div>;
  if (!item) return <div className="details-container">Title not found.</div>;

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
                category={category} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;