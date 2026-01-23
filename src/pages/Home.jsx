import React, { useState, useEffect } from 'react';
import MediaRow from '../components/MediaRow';
import { useLoading } from '../context/LoadingProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const transformItem = (item) => ({
  id: item.tconst,
  title: item.primaryTitle,
  genre: item.genres,
  releaseYear: item.startYear,
  rating: item.averageRating,
  numVotes: item.numVotes,
  imageUrl: null, // Will be fetched by MediaCard
  description: item.titleType
});

function HomePage() {
  const { stopLoading } = useLoading();
  const [animeData, setAnimeData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [error, setError] = useState(null);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [animeRes, showsRes, moviesRes] = await Promise.all([
        fetch(`${API_URL}/anime?limit=100&skip=0`),
        fetch(`${API_URL}/shows?limit=100&skip=0`),
        fetch(`${API_URL}/movies?limit=100&skip=0`)
      ]);

      const animeResult = await animeRes.json();
      const showsResult = await showsRes.json();
      const moviesResult = await moviesRes.json();

      setAnimeData(shuffleArray(animeResult.data || []).map(transformItem));
      setShowData(shuffleArray(showsResult.data || []).map(transformItem));
      setMovieData(shuffleArray(moviesResult.data || []).map(transformItem));
      setError(null);
      stopLoading();
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from server');
      stopLoading();
    }
  };

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