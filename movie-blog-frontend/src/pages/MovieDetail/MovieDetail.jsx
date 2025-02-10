import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../../services/api";
import "./MovieDetail.css";
import CommentSection from '../../components/Comments/CommentSection';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovieDetails(id);
        setMovie(response.data);
      } catch (err) {
        console.error("Film detay hatası:", err);
        setError("Film detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id, navigate]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Film bulunamadı</div>;

  return (
    <div className="movie-detail">
      <div className="backdrop">
        {movie.backdrop_path && (
          <img
            src={movie.backdrop_path}
            alt={movie.title}
            className="backdrop-image"
          />
        )}
        <div className="backdrop-overlay"></div>
      </div>

      <div className="content">
        <div className="poster">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="poster-image"
          />
        </div>

        <div className="info">
          <h1 className="title">{movie.title}</h1>
          
          <div className="meta">
            <span className="year">
              {movie.release_date?.split('-')[0]}
            </span>
            <span className="rating">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="runtime">
              {movie.runtime} dakika
            </span>
          </div>

          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="overview">{movie.overview}</p>

          {movie.hasTrailer && movie.trailer && (
            <div className="trailer-section">
              <h3>Fragman</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${movie.trailer.key}`}
                title={movie.trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="additional-info">
            <div className="info-item">
              <span className="label">Durum:</span>
              <span className="value">{movie.status.translated}</span>
            </div>
            <div className="info-item">
              <span className="label">Bütçe:</span>
              <span className="value">{movie.budget}</span>
            </div>
            <div className="info-item">
              <span className="label">Hasılat:</span>
              <span className="value">{movie.revenue}</span>
            </div>
            <div className="info-item">
              <span className="label">Orijinal Dil:</span>
              <span className="value">{movie.original_language}</span>
            </div>
          </div>
        </div>
      </div>
      
      <CommentSection type="movie" contentId={id} />
    </div>
  );
}

export default MovieDetail; 