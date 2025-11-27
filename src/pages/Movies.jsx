import React, { useState } from "react";
import AnimeCard from '../components/AnimeCard';
import AnimeSidebar from '../components/AnimeSidebar';
import { movieData, animeData } from '../data';
import '../styles/AnimePage.css';

function Movies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 });
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2024 });

  const uniqueGenres = [...new Set(movieData.map(item => item.genre))];

  const filteredMovies = movieData.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const genreMatch = selectedGenre === "All" || item.genre === selectedGenre;
    
    const ratingValue = parseFloat(item.rating);
    const ratingMatch = ratingValue >= ratingRange.min && ratingValue <= ratingRange.max;
    const yearMatch = item.releaseYear >= yearRange.min && item.releaseYear <= yearRange.max;

    return searchMatch && genreMatch && ratingMatch && yearMatch;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortOption) {
      case "rating-desc": return parseFloat(b.rating) - parseFloat(a.rating);
      case "rating-asc": return parseFloat(a.rating) - parseFloat(b.rating);
      case "year-desc": return b.releaseYear - a.releaseYear;
      case "year-asc": return a.releaseYear - b.releaseYear;
      default: return 0;
    }
  });

  const popularAnimeList = [...animeData].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5);
  const popularMovieList = [...movieData].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5);

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
        {sortedMovies.map((item) => (
          <AnimeCard key={item.id} item={item} category="movies" />
        ))}
        {sortedMovies.length === 0 && <h2 style={{color: 'white'}}>No movies found matching these filters.</h2>}
      </div>
    </div>
  );
}

export default Movies;