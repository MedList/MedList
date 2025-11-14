import React from "react";
import { Link } from "react-router-dom"; // 1. Import the <Link> component
import '../styles/Navbar.css'; 

export default function Navbar() {
  return (
    <nav>
      
      <Link className="navigation-link" to="/">Home</Link>
      <Link className="navigation-link" to="/anime">Anime</Link>
      <Link className="navigation-link" to="/manga">Manga</Link>
      <Link className="navigation-link" to="/movies">Movies</Link>
      <Link className="navigation-link" to="/shows">Shows</Link>
    </nav>
  );
}