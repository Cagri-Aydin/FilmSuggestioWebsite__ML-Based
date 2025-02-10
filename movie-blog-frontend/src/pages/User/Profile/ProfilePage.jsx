import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Yorumlarım"); // Aktif sekmeyi kontrol et
  const userComments = [
    { id: 1, movie: "Mission Impossible: Fallout", text: "Harika bir film, aksiyon sahneleri muhteşemdi!", rating: 9.5, date: "2024-12-01" },
    { id: 2, movie: "Breaking Bad", text: "Gelmiş geçmiş en iyi dizilerden biri!", rating: 10, date: "2024-11-20" },
  ];

  const likedMovies = [
    { id: 1, title: "Mission Impossible: Fallout", category: "Aksiyon Filmleri" },
    { id: 2, title: "Breaking Bad", category: "Diziler" },
    { id: 3, title: "The Mandalorian", category: "Diziler" },
    { id: 4, title: "The Last of Us", category: "Diziler" },
  ];

  const watchlistMovies = [
    { id: 1, title: "Inception" },
    { id: 2, title: "The Dark Knight" },
    { id: 3, title: "Interstellar" },
    { id: 4, title: "Dune" },
    { id: 5, title: "Tenet" },
    { id: 6, title: "The Matrix" },
    { id: 7, title: "Avatar" },
    { id: 8, title: "Gladiator" },
    { id: 9, title: "Pulp Fiction" },
  ];

  const categories = [...new Set(likedMovies.map((movie) => movie.category))];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Filmleri 8'erli gruplara ayıran yardımcı fonksiyon
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const [profileData, setProfileData] = useState({
    username: "cagriaydin",
    email: "cagri@example.com",
    password: "",
    created_at: "2024-10-01",
    profile_picture_url: "",
    bio: "Merhaba! Film ve dizi izlemeyi çok seviyorum.",
    birth_date: "1995-05-15",
    country: "Turkey",
    last_login: "2024-12-10",
    is_active: true,
    preferred_genres: "Action, Sci-fi",
    language_preference: "Turkish",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSave = () => {
    console.log("Saved Profile Data: ", profileData);
    alert("Profil başarıyla kaydedildi!");
  };

  return (
    <div className="profile-page">
      {/* Navigasyon Barı */}
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

      {/* Profil Bilgileri */}
      <div className="profile-info">
        <div className="profile-image">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-avatar"
          />
        </div>
        <div className="profile-details">
          <p className="profile-username">@cagriaydin</p>
          <p className="profile-joined">🎉 Joined October 2024</p>
          <div className="profile-stats">
            <span>30 Following</span>
            <span>1 Follower</span>
          </div>
        </div>
      </div>

      {/* Sekme Menüsü */}
      <div className="profile-tabs">
        <span
          className={`tab ${activeTab === "Yorumlarım" ? "active-tab" : ""}`}
          onClick={() => handleTabClick("Yorumlarım")}
        >
          Yorumlarım
        </span>
        <span
          className={`tab ${activeTab === "Beğendiklerim" ? "active-tab" : ""}`}
          onClick={() => handleTabClick("Beğendiklerim")}
        >
          Beğendiklerim
        </span>
        <span
          className={`tab ${activeTab === "İzleme Listem" ? "active-tab" : ""}`}
          onClick={() => handleTabClick("İzleme Listem")}
        >
          İzleme Listem
        </span>
        <span
          className={`tab ${activeTab === "Edit Profile" ? "active-tab" : ""}`}
          onClick={() => handleTabClick("Edit Profile")}
        >
          Profil Düzenle
        </span>
      </div>

      {/* Sekme İçeriği */}
      <div className="tab-content">
        {activeTab === "Yorumlarım" && (
          <div className="comments-section">
            <h2>Yorumlarım</h2>
            {userComments.length > 0 ? (
              userComments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <h3 className="comment-movie">{comment.movie}</h3>
                  <p><strong>Yorum:</strong> {comment.text}</p>
                  <p><strong>Puan:</strong> {comment.rating} / 10</p>
                  <span className="comment-date">{comment.date}</span>
                </div>
              ))
            ) : (
              <p>Henüz yorum yapmadınız.</p>
            )}
          </div>
        )}

        {activeTab === "Beğendiklerim" && (
          <div className="liked-movies">
            {categories.map((category) => (
              <div key={category} className="category-section">
                <h2 className="category-title">{category}</h2>
                <div className="movie-row">
                  {likedMovies
                    .filter((movie) => movie.category === category)
                    .map((movie) => (
                      <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                        <div className="movie-title">{movie.title}</div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "İzleme Listem" && (
          <div className="watchlist-section">
            {chunkArray(watchlistMovies, 8).map((movieRow, rowIndex) => (
              <div key={rowIndex} className="movie-row">
                {movieRow.map((movie) => (
                  <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                    <div className="movie-title">{movie.title}</div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "Profili Düzenle" && (
          <div className="edit-profile-section">
            <h2>Profili Düzenle</h2>
            <form className="edit-profile-form">
              <label>Kullanıcı Adı:
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                />
              </label>
              <label>Email:
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>Şifre:
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                />
              </label>
              <label>Profil Resmi URL:
                <input
                  type="text"
                  name="profile_picture_url"
                  value={profileData.profile_picture_url}
                  onChange={handleInputChange}
                />
              </label>
              <label>Biyografi:
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                ></textarea>
              </label>
              <label>Doğum Tarihi:
                <input
                  type="date"
                  name="birth_date"
                  value={profileData.birth_date}
                  onChange={handleInputChange}
                />
              </label>
              <label>Ülke:
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                />
              </label>
              <label>Tercih Edilen Türler:
                <input
                  type="text"
                  name="preferred_genres"
                  value={profileData.preferred_genres}
                  onChange={handleInputChange}
                />
              </label>
              <label>Tercih Edilen Dil:
                <input
                  type="text"
                  name="language_preference"
                  value={profileData.language_preference}
                  onChange={handleInputChange}
                />
              </label>
              <button type="button" onClick={handleProfileSave} className="save-profile-button">
                Kaydet
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
