import React, { useState, useEffect } from "react";
import AnimeCard from '../components/AnimeCard';
import AnimeSidebar from '../components/AnimeSidebar';
import '../styles/AnimePage.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Shows() {
  const [showData, setShowData] = useState([]);
  const [animeData, setAnimeData] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 });
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2024 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, animeRes, moviesRes] = await Promise.all([
        fetch(`${API_URL}/shows?limit=500`),
        fetch(`${API_URL}/anime?limit=100`),
        fetch(`${API_URL}/movies?limit=100`)
      ]);

      const showsResult = await showsRes.json();
      const animeResult = await animeRes.json();
      const moviesResult = await moviesRes.json();

      setShowData(showsResult.data || []);
      setAnimeData(animeResult.data || []);
      setMovieData(moviesResult.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = showData.filter(item => {
      const searchMatch = item.primaryTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const genreMatch = selectedGenre === "All" || (item.genres && item.genres.includes(selectedGenre));
      const ratingMatch = item.averageRating >= ratingRange.min && item.averageRating <= ratingRange.max;
      const yearMatch = item.startYear >= yearRange.min && item.startYear <= yearRange.max;

      return searchMatch && genreMatch && ratingMatch && yearMatch;
    });

    setFilteredShows(filtered);
  }, [showData, searchQuery, selectedGenre, ratingRange, yearRange]);

  const sortedShows = [...filteredShows].sort((a, b) => {
    switch (sortOption) {
      case "rating-desc": return (b.averageRating || 0) - (a.averageRating || 0);
      case "rating-asc": return (a.averageRating || 0) - (b.averageRating || 0);
      case "year-desc": return b.startYear - a.startYear;
      case "year-asc": return a.startYear - b.startYear;
      default: return 0;
    }
  });

  const uniqueGenres = [...new Set(
    showData
      .flatMap(item => item.genres ? item.genres.split(',') : [])
      .filter(Boolean)
  )];

  const popularAnimeList = [...animeData]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 5);

  const popularMovieList = [...movieData]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 5);

  if (loading) return <div style={{color: 'var(--text-primary)', padding: '20px'}}>Loading show data...</div>;
  if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;

  return (
    <div className="anime-page-container">
      <AnimeSidebar 
        popularAnime={popularAnimeList}
        popularMovies={popularMovieList}
        uniqueGenres={uniqueGenres}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGenreChange={setSelectedGenre}
        onSortChange={setSortOption}
        onRatingChange={setRatingRange}
        onYearChange={setYearRange}
      />

      <div className="anime-list-container">
        {sortedShows.map((item) => (
          <AnimeCard 
            key={item.tconst}
            item={{
              id: item.tconst,
              title: item.primaryTitle,
              genre: item.genres,
              releaseYear: item.startYear,
              rating: item.averageRating,
              numVotes: item.numVotes,
              imageUrl: item.imdb_url,
              description: item.titleType
            }}
            category="shows" 
          />
        ))}
        {sortedShows.length === 0 && <h2 style={{color: 'var(--text-primary)'}}>No shows found matching these filters.</h2>}
      </div>
    </div>
  );
}

export default Shows;