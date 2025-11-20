import React, { useState } from "react";
import AnimeCard from '../components/AnimeCard';
import AnimeSidebar from '../components/AnimeSidebar';
import { animeData, movieData } from '../data';
import '../styles/AnimePage.css';

function Anime() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("default"); 
  const [minRating, setMinRating] = useState(0);
  const [minYear, setMinYear] = useState(2000);

  const uniqueGenres = [...new Set(animeData.map(item => item.genre))];

  const filteredAnime = animeData.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const genreMatch = selectedGenre === "All" || item.genre === selectedGenre;
    const ratingMatch = parseFloat(item.rating) >= minRating;
    const yearMatch = item.releaseYear >= minYear;

    return searchMatch && genreMatch && ratingMatch && yearMatch;
  });

  const sortedAnime = [...filteredAnime].sort((a, b) => {
    switch (sortOption) {
      case "rating-desc":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "rating-asc":
        return parseFloat(a.rating) - parseFloat(b.rating);
      case "year-desc":
        return b.releaseYear - a.releaseYear;
      case "year-asc":
        return a.releaseYear - b.releaseYear;
      default:
        return 0; 
    }
  });

  const popularAnimeList = [...animeData]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  const popularMovieList = [...movieData]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  return (
    <div className="anime-page-container">
      
      <AnimeSidebar 
        popularAnime={popularAnimeList} 
        popularMovies={popularMovieList}
        uniqueGenres={uniqueGenres}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGenreChange={setSelectedGenre}
        minRating={minRating}
        onRatingChange={setMinRating}
        minYear={minYear}
        onYearChange={setMinYear}
        onSortChange={setSortOption}
      />

      <div className="anime-list-container">
        {sortedAnime.map((item) => (
          <AnimeCard key={item.id} item={item} />
        ))}

        {sortedAnime.length === 0 && (
          <h2 style={{color: 'white'}}>No anime found matching these filters.</h2>
        )}
      </div>
      
    </div>
  );
}

export default Anime;