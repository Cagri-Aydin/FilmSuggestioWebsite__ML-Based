import React from 'react';
import { Link } from 'react-router-dom';
import './TvShowCard.css';

function TvShowCard({ tvShow }) {
  return (
    <Link to={`/tv/${tvShow.id}`} className="tvshow-card">
      <div className="tvshow-poster">
        <img 
          src={tvShow.poster_path 
            ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
            : '/placeholder.jpg'
          } 
          alt={tvShow.name}
        />
      </div>
      <div className="tvshow-info">
        <h3>{tvShow.name}</h3>
        <div className="tvshow-meta">
          <span className="tvshow-year">
            {new Date(tvShow.first_air_date).getFullYear()}
          </span>
          <span className="tvshow-rating">
            ⭐ {tvShow.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default TvShowCard; 