import React, { useState, useEffect } from 'react';
import discoverService from '../../services/discoverService';

function DiscoverFilter() {
  const [filters, setFilters] = useState({
    sortBy: 'popularity.desc',
    year: 2024,
    genres: [],
    minRating: 7,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (type = 'movie') => {
    try {
      setLoading(true);
      const data = type === 'movie' 
        ? await discoverService.discoverMovies(filters)
        : await discoverService.discoverTVShows(filters);
      
      setResults(data.results);
    } catch (error) {
      console.error('Filtreleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="discover-filter">
      <div className="filter-controls">
        <select 
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="popularity.desc">Popülerlik (Azalan)</option>
          <option value="vote_average.desc">Puan (Azalan)</option>
          <option value="release_date.desc">Yayın Tarihi (Yeni)</option>
        </select>

        <input 
          type="number"
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          min="1900"
          max="2024"
        />

        <input 
          type="number"
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          min="0"
          max="10"
          step="0.1"
        />

        {/* Genre seçimi için checkbox'lar eklenebilir */}
      </div>

      <div className="filter-buttons">
        <button onClick={() => fetchResults('movie')} disabled={loading}>
          Filmleri Filtrele
        </button>
        <button onClick={() => fetchResults('tv')} disabled={loading}>
          Dizileri Filtrele
        </button>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="results-grid">
          {results.map(item => (
            <div key={item.id} className="result-card">
              {/* Sonuç kartı içeriği */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverFilter; 