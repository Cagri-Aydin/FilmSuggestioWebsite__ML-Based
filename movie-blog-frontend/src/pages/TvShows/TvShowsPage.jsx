import React, { useState, useEffect } from 'react';
import { discoverService } from '../../services/discoverService';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './TvShowsPage.css';

function TvShowsPage() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'popularity.desc',
    year: 2024,
    genres: [],
    minRating: 0
  });
  
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await discoverService.getTVGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Dizi Kategorileri Hatası:', error.message);
      }
    };

    fetchGenres();
  }, []);

  const fetchTvShows = async (filterParams) => {
    try {
      setLoading(true);
      const data = await discoverService.discoverTVShows(filterParams);
      setTvShows(data.results || []);
    } catch (error) {
      console.error('Dizi Keşfet Hatası:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTvShows(filters);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      sortBy: 'popularity.desc',
      year: 2024,
      genres: [],
      minRating: 0
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const handleGenreChange = (genreId) => {
    setTempFilters(prev => {
      const currentGenres = prev.genres || [];
      if (currentGenres.includes(genreId)) {
        return {
          ...prev,
          genres: currentGenres.filter(id => id !== genreId)
        };
      } else {
        return {
          ...prev,
          genres: [...currentGenres, genreId]
        };
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="tv-shows-page">
      {/* Filtre Bölümü */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-group">
            <label>Sıralama</label>
            <select 
              value={tempFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="popularity.desc">En Popüler</option>
              <option value="vote_average.desc">En Yüksek Puan</option>
              <option value="first_air_date.desc">En Yeni</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Yıl</label>
            <input 
              type="number"
              value={tempFilters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="filter-input"
              min="1900"
              max="2024"
            />
          </div>

          <div className="filter-group genres-group">
            <label>Kategoriler</label>
            <div className="genres-container">
              {genres.map(genre => (
                <label key={genre.id} className="genre-checkbox">
                  <input
                    type="checkbox"
                    checked={tempFilters.genres?.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id)}
                  />
                  <span>{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Puan</label>
            <input 
              type="number"
              value={tempFilters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="filter-input"
              min="0"
              max="10"
              step="0.1"
            />
          </div>

          <div className="filter-buttons">
            <button onClick={handleApplyFilters} className="filter-button apply">
              Filtrele
            </button>
            <button onClick={handleResetFilters} className="filter-button reset">
              Sıfırla
            </button>
          </div>
        </div>
      </div>

      {/* Dizi Grid */}
      <div className="content-section">
        <div className="tv-shows-grid">
          {tvShows.map(show => (
            <Link to={`/tv/${show.id}`} key={show.id} className="tv-show-card">
              <div className="tv-show-poster">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                  alt={show.name}
                  loading="lazy"
                />
                <div className="tv-show-details">
                  <h3>{show.name}</h3>
                  <div className="tv-show-info">
                    <span className="tv-show-year">
                      {new Date(show.first_air_date).getFullYear()}
                    </span>
                    <div className="tv-show-rating">
                      <FaStar className="star-icon" />
                      <span>{show.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="tv-show-overview">{show.overview}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TvShowsPage; 