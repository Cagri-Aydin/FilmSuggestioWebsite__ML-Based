import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";
import pp from "./komikcocuk.png"

function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Yorumlarım");
  const [userComments, setUserComments] = useState([]);
  const [likedContent, setLikedContent] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    id: null,
    username: "",
    email: "",
    profile_picture_url: "",
    bio: "",
    created_at: "",
    country: "",
    preferred_genres: [],
    language_preference: "",
    followers_count: 0,
    following_count: 0
  });
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('userId');
  });
  const [userData, setUserData] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const token = localStorage.getItem("token");
  const targetUserId = userId || currentUserId;

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        navigate('/login');
        return;
    }

    try {
        const tokenParts = token.split('.');
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const tokenData = JSON.parse(atob(base64));
        
        console.log('Token data:', tokenData);
        
        const extractedUserId = tokenData.id || tokenData.userId || tokenData.sub;
        
        if (!extractedUserId) {
            throw new Error('Token içinde userId bulunamadı');
        }

        setCurrentUserId(extractedUserId);
        const targetId = userId || extractedUserId;
        
        console.log('Target userId for fetch:', targetId);
        fetchProfileData(targetId, token);

    } catch (error) {
        console.error('Token işleme hatası:', error);
        setError('Oturum bilgileriniz geçersiz. Lütfen tekrar giriş yapın.');
        navigate('/login');
    }
  }, [userId, navigate]);

  const fetchProfileData = async (targetUserId, token) => {
    setIsLoading(true);
    try {
        const url = `http://localhost:5050/api/profile/${targetUserId}`;
        console.log('Requesting URL:', url);
        console.log('Token:', token);

        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            validateStatus: function (status) {
                console.log('Response status:', status);
                return status < 500;
            }
        });

        if (response.status === 404) {
            throw new Error(`Kullanıcı bulunamadı (ID: ${targetUserId})`);
        }

        console.log('Profile response:', response.data);

        if (response.data) {
            setProfileData(response.data);
            setError(null);
        }
    } catch (err) {
        console.error("Profil yükleme hatası:", err);
        console.error("Tam hata detayı:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers
        });
        
        setError(`Profil bilgileri yüklenirken bir hata oluştu: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchUserComments = async (userId, token) => {
    if (!userId) {
        console.error('UserId not found');
        return;
    }

    setIsLoadingComments(true);
    try {
        console.log('Fetching comments for user:', userId);
        const response = await axios({
            method: 'get',
            url: `http://localhost:5050/api/user-comments/${userId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Comments response:', response.data);
        setUserComments(response.data);
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
    } finally {
        setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered. ActiveTab:', activeTab);
    if (activeTab === "Yorumlarım" && currentUserId) {
        fetchUserComments(currentUserId, token);
    }
  }, [activeTab]);

  useEffect(() => {
    console.log('userComments state updated:', userComments);
  }, [userComments]);

  const renderComments = () => {
    if (isLoadingComments) return <div>Yorumlar yükleniyor...</div>;
    
    if (!userComments || userComments.length === 0) {
        return <div>Henüz yorum yapmamışsınız.</div>;
    }

    return (
        <div className="comments-container">
            {userComments.map(comment => (
                <div key={comment.id} className="comment-card">
                    <div className="comment-body">
                        <p className="comment-content">{comment.content}</p>
                        <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  if (!token || !currentUserId) {
    return <div className="error-container">Lütfen giriş yapın</div>;
  }

  if (isLoading) {
    return <div className="loading-container">Profil yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            src={profileData.profile_picture_url || "/default-avatar.png"}
            alt={profileData.username}
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = pp;
            }}
          />
        </div>
        <div className="profile-info">
          <h2>{profileData.username}</h2>
          <p className="bio">{profileData.bio || "Henüz bir biyografi eklenmemiş."}</p>
          <div className="profile-details">
            <span className="country">
              <i className="fas fa-map-marker-alt"></i> {profileData.country || "Belirtilmemiş"}
            </span>
            <span className="join-date">
              Katılım: {new Date(profileData.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profileData.followers_count}</span>
              <span className="stat-label">Takipçi</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.following_count}</span>
              <span className="stat-label">Takip Edilen</span>
            </div>
          </div>
          {profileData.preferred_genres?.length > 0 && (
            <div className="genres">
              <h4>Tercih Edilen Türler:</h4>
              <div className="genre-tags">
                {profileData.preferred_genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === "Yorumlarım" ? "active" : ""}`}
          onClick={() => {
            console.log('Yorumlarım tab clicked');
            setActiveTab("Yorumlarım");
          }}
        >
          Yorumlarım
        </button>
        {String(targetUserId) === String(currentUserId) && (
          <button 
            className={`tab-button ${activeTab === "Profil Düzenle" ? "active" : ""}`}
            onClick={() => setActiveTab("Profil Düzenle")}
          >
            Profil Düzenle
          </button>
        )}
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );

  function renderTabContent() {
    if (!profileData) return null;

    switch (activeTab) {
      case "Yorumlarım":
        return (
          <div className="comments-section">
            {renderComments()}
          </div>
        );

      case "Beğendiklerim":
        return (
          <div className="liked-content">
            {likedContent?.length > 0 ? (
              likedContent.map((item) => (
                <div key={item.id} className="content-item">
                  <Link to={`/${item.content_type}/${item.content_id}`}>
                    <h3>{item.title || "Başlıksız İçerik"}</h3>
                    <p>{item.content_type === 'movie' ? 'Film' : 'Dizi'}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p>Henüz beğenilen içerik yok.</p>
            )}
          </div>
        );

      case "İzleme Listem":
        return (
          <div className="watchlist">
            {watchlist?.length > 0 ? (
              watchlist.map((item) => (
                <div key={item.id} className="content-item">
                  <Link to={`/${item.content_type}/${item.content_id}`}>
                    <h3>{item.title || "Başlıksız İçerik"}</h3>
                    <p>{item.content_type === 'movie' ? 'Film' : 'Dizi'}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p>İzleme listeniz boş.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  }
}

export default ProfilePage;
