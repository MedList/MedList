import React from 'react';
import StarRating from './StarRating';
import DoubleRangeSlider from './DoubleRangeSlider'; 
import '../styles/Sidebar.css';

function AnimeSidebar({ 
  popularAnime, 
  popularMovies, 
  uniqueGenres, 
  searchQuery, 
  onSearchChange, 
  onGenreChange, 
  onRatingChange,
  onYearChange,
  onSortChange
}) {
  return (
    <div className="sidebar-container">
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search an anime..." 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div>
        <h3 className="sidebar-section-title">Sort By</h3>
        <select className="genre-select" onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">No Sorting</option>
          <option value="rating-desc">Highest Rating</option>
          <option value="rating-asc">Lowest Rating</option>
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
        </select>
      </div>

      <div>
        <h3 className="sidebar-section-title">Filter by Genre</h3>
        <select className="genre-select" onChange={(e) => onGenreChange(e.target.value)}>
          <option value="All">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      
      <div style={{ marginBottom: '30px' }}>
        <DoubleRangeSlider 
          title="Rating Range"
          min={0}
          max={10}
          step={0.5}
          initialMin={0}
          initialMax={10}
          onChange={onRatingChange}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <DoubleRangeSlider 
          title="Year Range"
          min={1990}
          max={2024}
          step={1}
          initialMin={1990}
          initialMax={2024}
          onChange={onYearChange}
        />
      </div>


      <div>
        <h3 className="sidebar-section-title">Popular Anime:</h3>
        <ul className="popular-list">
          {popularAnime.map(item => (
            <li key={item.id} className="popular-item">
              <span>{item.title}</span>
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'right center' }}>
                <StarRating rating={item.rating} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      
       <div>
        <h3 className="sidebar-section-title">Popular Movies:</h3>
        <ul className="popular-list">
          {popularMovies.map(item => (
            <li key={item.id} className="popular-item">
              <span>{item.title}</span>
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'right center' }}>
                <StarRating rating={item.rating} />
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default AnimeSidebar;