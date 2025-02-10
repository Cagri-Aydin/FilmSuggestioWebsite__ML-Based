import React from 'react';
import { Link } from 'react-router-dom';
import { TMDB_IMAGE_URL } from '../../services/api';
import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="content-card">
      <img 
        src={`${TMDB_IMAGE_URL}${movie.poster_path}`} 
        alt={movie.title} 
      />
      <div className="content-info">
        <h3>{movie.title}</h3>
        <div className="content-meta">
          <span>{movie.release_date?.split('-')[0]}</span>
          <span>⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard; 