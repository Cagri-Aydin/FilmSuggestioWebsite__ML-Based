import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../../services/api";
import "./TvShowDetail.css";
import CommentSection from '../../components/Comments/CommentSection';

function TvShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        setLoading(true);
        const response = await movieService.getTvShowDetails(id);
        setTvShow(response.data);
      } catch (err) {
        console.error("Dizi detay hatası:", err);
        setError("Dizi detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTvShowDetails();
    }
  }, [id, navigate]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tvShow) return <div className="error">Dizi bulunamadı</div>;

  return (
    <div className="tv-show-detail">
      <div className="backdrop">
        {tvShow.backdrop_path && (
          <img
            src={tvShow.backdrop_path}
            alt={tvShow.name}
            className="backdrop-image"
          />
        )}
        <div className="backdrop-overlay"></div>
      </div>

      <div className="content">
        <div className="poster">
          <img
            src={tvShow.poster_path}
            alt={tvShow.name}
            className="poster-image"
          />
        </div>

        <div className="info">
          <h1 className="title">{tvShow.name}</h1>
          
          <div className="meta">
            <span className="year">
              {tvShow.first_air_date?.split('-')[0]}
            </span>
            <span className="rating">
              ⭐ {tvShow.vote_average?.toFixed(1)}
            </span>
            <span className="seasons">
              {tvShow.seasons.count} Sezon
            </span>
            <span className="episodes">
              {tvShow.seasons.episodes} Bölüm
            </span>
          </div>

          <div className="genres">
            {tvShow.genres?.map(genre => (
              <span key={genre.id} className="genre">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="overview">{tvShow.overview}</p>

          <div className="additional-info">
            <div className="info-item">
              <span className="label">Durum:</span>
              <span className="value">{tvShow.status.translated}</span>
            </div>
            <div className="info-item">
              <span className="label">Ağ:</span>
              <span className="value">
                {tvShow.networks?.map(network => network.name).join(', ')}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Tür:</span>
              <span className="value">
                {tvShow.type.translated}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Ortalama Bölüm Süresi:</span>
              <span className="value">
                {tvShow.episodeRunTime.formatted}
              </span>
            </div>
          </div>

          {tvShow.hasTrailer && tvShow.trailer && (
            <div className="trailer-section">
              <h3>Fragman</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${tvShow.trailer.key}`}
                title={tvShow.trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      <CommentSection type="tv" contentId={id} />
    </div>
  );
}

export default TvShowDetail; 