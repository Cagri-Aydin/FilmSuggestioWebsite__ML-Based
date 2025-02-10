import React from 'react';
import './MediaFilters.css';

function MediaFilters({ filters, onFilterChange }) {
  const years = Array.from({ length: 24 }, (_, i) => 2024 - i);
  const genres = [
    { id: 28, name: "Aksiyon" },
    { id: 12, name: "Macera" },
    { id: 16, name: "Animasyon" },
    { id: 35, name: "Komedi" },
    { id: 80, name: "Suç" },
    { id: 99, name: "Belgesel" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Aile" },
    { id: 14, name: "Fantastik" },
    { id: 36, name: "Tarih" },
    { id: 27, name: "Korku" },
    { id: 10402, name: "Müzik" },
    { id: 9648, name: "Gizem" },
    { id: 10749, name: "Romantik" },
    { id: 878, name: "Bilim Kurgu" },
    { id: 53, name: "Gerilim" },
    { id: 10752, name: "Savaş" },
  ];

  return (
    <div className="media-filters">
      <div className="filter-section">
        <h3>Sıralama</h3>
        <select 
          value={filters.sortBy} 
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <option value="popularity.desc">Popülerliğe Göre</option>
          <option value="vote_average.desc">Puana Göre (Yüksek)</option>
          <option value="vote_average.asc">Puana Göre (Düşük)</option>
          <option value="release_date.desc">Yeniden Eskiye</option>
          <option value="release_date.asc">Eskiden Yeniye</option>
        </select>
      </div>

      <div className="filter-section">
        <h3>Yıl</h3>
        <select 
          value={filters.year} 
          onChange={(e) => onFilterChange('year', e.target.value)}
        >
          <option value="">Tüm Yıllar</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h3>Kategoriler</h3>
        <div className="genre-list">
          {genres.map(genre => (
            <label key={genre.id} className="genre-item">
              <input
                type="checkbox"
                checked={filters.genres.includes(genre.id)}
                onChange={(e) => {
                  const newGenres = e.target.checked
                    ? [...filters.genres, genre.id]
                    : filters.genres.filter(id => id !== genre.id);
                  onFilterChange('genres', newGenres);
                }}
              />
              {genre.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Minimum Puan</h3>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', e.target.value)}
        />
        <span>{filters.minRating}</span>
      </div>

      <button 
        className="clear-filters"
        onClick={() => onFilterChange('clear')}
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}

export default MediaFilters; 