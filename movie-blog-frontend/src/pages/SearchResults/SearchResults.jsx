import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { movieService } from '../../services/api';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const response = await movieService.searchMovies(query, page);
        setResults(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        console.error('Arama hatası:', err);
        setError('Arama sonuçları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) return <div className="loading">Aranıyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!results.length) return <div className="no-results">Sonuç bulunamadı.</div>;

  return (
    <div className="search-results">
      <h2>"{query}" için arama sonuçları</h2>
      <div className="results-grid">
        {results.map(item => (
          <Link 
            key={item.id} 
            to={`/${item.media_type}/${item.id}`} 
            className="result-card"
          >
            <img 
              src={item.poster_path} 
              alt={item.title || item.name} 
              className="result-poster"
            />
            <div className="result-info">
              <h3>{item.title || item.name}</h3>
              <p>{item.media_type === 'movie' ? 'Film' : 'Dizi'}</p>
              <div className="result-meta">
                <span className="rating">⭐ {item.vote_average?.toFixed(1)}</span>
                <span className="year">
                  {(item.release_date || item.first_air_date)?.split('-')[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {page < totalPages && (
        <div className="load-more">
          <button onClick={handleLoadMore} className="load-more-button">
            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults; 