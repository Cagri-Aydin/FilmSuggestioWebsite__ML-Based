import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          FilmBlog
        </Link>
        <Link to="/movies" className="nav-link">Filmler</Link>
        <Link to="/tv-shows" className="nav-link">Diziler</Link>
        <Link to="/blog-page" className="nav-link">Blog</Link>
        <Link to="/recommendations" className="nav-link">Film Önerisi</Link>

      </div>

      <form onSubmit={handleSearch} className="search-container">
        <input
          type="search"
          placeholder="Film, dizi veya blog ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </form>

      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">Profil</Link>
            <button onClick={logout} className="nav-button">Çıkış</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Giriş</Link>
            <Link to="/register" className="nav-button">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 