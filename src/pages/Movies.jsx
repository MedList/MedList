import React, { useState, useEffect, useCallback } from "react";
import AnimeCard from '../components/AnimeCard';
import AnimeSidebar from '../components/AnimeSidebar';
import '../styles/AnimePage.css';
import { useLoading } from '../context/LoadingProvider';

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 20;

function Movies() {
  const { stopLoading } = useLoading();
  const [movieData, setMovieData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("popularity");
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 });
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2024 });

  const [popularAnime, setPopularAnime] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      const [animeRes, moviesRes] = await Promise.all([
        fetch(`${API_URL}/anime?limit=5&sort=rating&order=desc`),
        fetch(`${API_URL}/movies?limit=5&sort=rating&order=desc`)
      ]);
      
      const animeResult = await animeRes.json();
      const moviesResult = await moviesRes.json();
      
      setPopularAnime((animeResult.data || []).map(item => ({
        id: item.tconst,
        title: item.primaryTitle,
        rating: item.averageRating
      })));
      
      setPopularMovies((moviesResult.data || []).map(item => ({
        id: item.tconst,
        title: item.primaryTitle,
        rating: item.averageRating
      })));
      
      // Get unique genres from a larger sample
      const genreRes = await fetch(`${API_URL}/movies?limit=200&skip=0`);
      const genreResult = await genreRes.json();
      const uniqueGenres = [...new Set(
        (genreResult.data || [])
          .flatMap(item => item.genres ? item.genres.split(',') : [])
          .map(g => g.trim())
          .filter(Boolean)
      )];
      setGenres(uniqueGenres);
    } catch (err) {
      console.error('Failed to fetch sidebar data:', err);
    }
  };

  // Build API URL with filters
  const buildApiUrl = useCallback(() => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    let url = `${API_URL}/movies/search?skip=${skip}&limit=${ITEMS_PER_PAGE}`;
    
    if (searchQuery) url += `&name=${encodeURIComponent(searchQuery)}`;
    if (selectedGenre !== "All") url += `&genre=${encodeURIComponent(selectedGenre)}`;
    if (ratingRange.min > 0) url += `&minRating=${ratingRange.min}`;
    if (ratingRange.max < 10) url += `&maxRating=${ratingRange.max}`;
    if (yearRange.min > 1980) url += `&minYear=${yearRange.min}`;
    if (yearRange.max < 2024) url += `&maxYear=${yearRange.max}`;
    
    // Map sort options to API parameters
    if (sortOption === "rating-desc") url += `&sort=rating&order=desc`;
    else if (sortOption === "rating-asc") url += `&sort=rating&order=asc`;
    else if (sortOption === "year-desc") url += `&sort=year&order=desc`;
    else if (sortOption === "year-asc") url += `&sort=year&order=asc`;
    else if (sortOption === "popularity") url += `&sort=popularity&order=desc`;
    
    return url;
  }, [page, searchQuery, selectedGenre, ratingRange, yearRange, sortOption]);

  // Fetch data when filters change
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const url = buildApiUrl();
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setMovieData([]);
          setTotalItems(0);
          return;
        }
        throw new Error('Failed to fetch');
      }
      
      const result = await response.json();
      setMovieData(result.data || []);
      setTotalItems(result.total || 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [buildApiUrl, stopLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedGenre, ratingRange, yearRange, sortOption]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;

  return (
    <div className="anime-page-container">
      <AnimeSidebar 
        popularAnime={popularAnime}
        popularMovies={popularMovies}
        uniqueGenres={genres}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGenreChange={setSelectedGenre}
        onSortChange={setSortOption}
        onRatingChange={setRatingRange}
        onYearChange={setYearRange}
      />

      <div className="anime-list-container">
        {loading ? (
          <div style={{color: 'var(--text-primary)', padding: '20px'}}></div>
        ) : movieData.length > 0 ? (
          movieData.map((item) => (
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
              category="movies" 
            />
          ))
        ) : (
          <h2 style={{color: 'var(--text-primary)'}}>No movies found matching these filters.</h2>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Movies;