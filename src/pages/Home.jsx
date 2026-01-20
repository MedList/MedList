import React, { useState, useEffect } from 'react';
import MediaRow from '../components/MediaRow';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
function HomePage() {
  const [animeData, setAnimeData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [animeRes, showsRes, moviesRes] = await Promise.all([
        fetch(`${API_URL}/anime?limit=10`),
        fetch(`${API_URL}/shows?limit=10`),
        fetch(`${API_URL}/movies?limit=10`)
      ]);

      const animeResult = await animeRes.json();
      const showsResult = await showsRes.json();
      const moviesResult = await moviesRes.json();

      setAnimeData(animeResult.data || []);
      setShowData(showsResult.data || []);
      setMovieData(moviesResult.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{color: 'var(--text-primary)', padding: '20px'}}>Loading...</div>;
  if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;

  return (
    <div>
      <MediaRow title="Suggested Anime" items={animeData} />
      <br></br>
      <MediaRow title="Suggested Shows" items={showData} />
      <MediaRow title="Suggested Movies" items={movieData} />
    </div>
  );
}

export default HomePage;