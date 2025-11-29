import React from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'; 

export default function Navbar() {
  return (
    <nav>
      <Link className="navigation-link" to="/">Home</Link>
      <Link className="navigation-link" to="/anime">Anime</Link>
      <Link className="navigation-link" to="/movies">Movies</Link>
      <Link className="navigation-link" to="/shows">Shows</Link>
      <Link className="navigation-link" to="/favorites">Saved</Link>
    </nav>
  );
}