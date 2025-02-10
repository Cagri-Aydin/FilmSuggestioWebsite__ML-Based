import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPage.css";
import { moviesAPI } from "../../utils/axios";

function AdminPage() {
  const [movies, setMovies] = useState([]);

  const handleAddMovie = async (movieData) => {
    try {
      await moviesAPI.create(movieData);
      // Listeyi güncelle
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      console.error("Film eklenirken hata:", err);
    }
  };

  const handleEditMovie = async (id, movieData) => {
    try {
      await moviesAPI.update(id, movieData);
      // Listeyi güncelle
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      console.error("Film güncellenirken hata:", err);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await moviesAPI.delete(id);
      // Listeyi güncelle
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (err) {
      console.error("Film silinirken hata:", err);
    }
  };

  return (
    <div className="admin-page">
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-item">Ana Sayfa</Link>
          <Link to="/series" className="navbar-item">Diziler</Link>
          <Link to="/movies" className="navbar-item">Filmler</Link>
          <Link to="/new" className="navbar-item">Yeni ve Popüler</Link>
          <Link to="/list" className="navbar-item">Listem</Link>
        </div>
        <div className="navbar-middle">
          <input type="text" placeholder="Film veya dizi ara..." className="search-input" />
        </div>
        <div className="navbar-right">
          <i className="navbar-icon fas fa-bell"></i>
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            className="navbar-profile"
          />
        </div>
      </div>

      {/* Admin Panel */}
      <div className="admin-panel">
        <h1>Admin Panel</h1>

        {/* Add/Edit Movie Form */}
        <div className="add-movie-container">
          <h2>{editMode ? "Edit Movie" : "Add New Movie"}</h2>
          <input
            type="text"
            name="title"
            placeholder="Movie Name"
            value={newMovie.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={newMovie.genre}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newMovie.description}
            onChange={handleInputChange}
          ></textarea>
          <input
            type="text"
            name="trailer_url"
            placeholder="Trailer URL"
            value={newMovie.trailer_url}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="release_year"
            placeholder="Release Year"
            value={newMovie.release_year}
            onChange={handleInputChange}
          />
          <button onClick={editMode ? handleSaveEditMovie : handleAddMovie}>
            {editMode ? "Save Changes" : "Add Movie"}
          </button>
        </div>

        {/* Movies Table */}
        <div className="movies-list-container">
          <h2>Movies List</h2>
          <input
            type="text"
            placeholder="Search movies..."
            className="movie-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && filteredMovies.length > 0 ? (
            <table className="movies-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Description</th>
                  <th>Trailer URL</th>
                  <th>Release Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.description}</td>
                    <td>
                      <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                        Watch Trailer
                      </a>
                    </td>
                    <td>{movie.release_year}</td>
                    <td>
                      <button onClick={() => handleEditMovie(movie.id)}>Edit</button>
                      <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            searchTerm && <p>No movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
