import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { movieService, TMDB_IMAGE_URL } from "../../services/api";
import "./MainPage.css";

function MainPage() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movies, setMovies] = useState({
    popular: [],
    nowPlaying: [],
    upcoming: [],
    topRated: []
  });
  
  const [tvShows, setTvShows] = useState({
    popular: [],
    onTheAir: [],
    topRated: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Film verileri
        const [popularMovies, nowPlayingMovies, upcomingMovies, topRatedMovies] = 
          await Promise.all([
            movieService.getPopularMovies(),
            movieService.getNowPlayingMovies(),
            movieService.getUpcomingMovies(),
            movieService.getTopRatedMovies()
          ]);

        // İlk popüler filmi featured olarak ayarla
        setFeaturedMovie(popularMovies.data.results[0]);

        setMovies({
          popular: popularMovies.data.results,
          nowPlaying: nowPlayingMovies.data.results,
          upcoming: upcomingMovies.data.results,
          topRated: topRatedMovies.data.results
        });

        // Dizi verileri
        const [popularTv, onTheAirTv, topRatedTv] = 
          await Promise.all([
            movieService.getPopularTvShows(),
            movieService.getOnTheAirTvShows(),
            movieService.getTopRatedTvShows()
          ]);

        setTvShows({
          popular: popularTv.data.results,
          onTheAir: onTheAirTv.data.results,
          topRated: topRatedTv.data.results
        });

      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
      }
    };

    fetchData();
  }, []);

  const MovieCard = ({ item, type = 'movie' }) => (
    <Link to={`/${type}/${item.id}`} className="movie-card">
      <div className="movie-poster">
        <img src={`${TMDB_IMAGE_URL}${item.poster_path}`} alt={item.title || item.name} />
        <div className="movie-title-overlay">
          <h3 className="movie-title">{item.title || item.name}</h3>
        </div>
        <div className="movie-hover-overlay">
          <div className="movie-info">
            <h3 className="movie-title">{item.title || item.name}</h3>
            <div className="movie-meta">
              <span>{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
              <span>⭐ {item.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="main-page">
      {/* Featured Movie Section */}
      {featuredMovie && (
        <div className="trailer-section">
          <div 
            className="trailer-backdrop"
            style={{
              backgroundImage: `url(${TMDB_IMAGE_URL}${featuredMovie.backdrop_path})`
            }}
          />
          <div className="trailer-overlay" />
          <div className="trailer-content">
            <h1 className="trailer-title">{featuredMovie.title}</h1>
            <p className="trailer-overview">{featuredMovie.overview}</p>
            <div className="trailer-actions">
              <Link to={`/movie/${featuredMovie.id}`} className="watch-button">
                İzle
              </Link>
              {featuredMovie.hasTrailer && (
                <button className="trailer-button">Fragman</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie Categories */}
      <div className="category-section">
        <h2 className="category-title">Popüler Filmler</h2>
        <div className="movie-row">
          {movies.popular?.map(movie => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">Vizyondaki Filmler</h2>
        <div className="movie-row">
          {movies.nowPlaying?.map(movie => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">Yakında Gelecek Filmler</h2>
        <div className="movie-row">
          {movies.upcoming?.map(movie => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">En İyi Filmler</h2>
        <div className="movie-row">
          {movies.topRated?.map(movie => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </div>

      {/* Diziler */}
      <div className="category-section">
        <h2 className="category-title">Popüler Diziler</h2>
        <div className="movie-row">
          {tvShows.popular?.map(show => (
            <MovieCard key={show.id} item={show} type="tv" />
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">Yayında Olan Diziler</h2>
        <div className="movie-row">
          {tvShows.onTheAir?.map(show => (
            <MovieCard key={show.id} item={show} type="tv" />
          ))}
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">En İyi Diziler</h2>
        <div className="movie-row">
          {tvShows.topRated?.map(show => (
            <MovieCard key={show.id} item={show} type="tv" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
