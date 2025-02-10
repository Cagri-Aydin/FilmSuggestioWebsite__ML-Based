import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/CommentService';
import './CommentSection.css';

function CommentSection({ type, contentId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  
  const { isAuthenticated, user } = useAuth();

  const fetchComments = async () => {
    if (!contentId) {
      setError('İçerik ID bulunamadı');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const getComments = type === 'movie' 
        ? commentService.getMovieComments
        : commentService.getTvShowComments;

      const response = await getComments(contentId, page);
      
      setComments(response.comments || []);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      console.error('Yorum yükleme hatası:', err);
      setError(err.message);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [contentId, page, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !contentId) return;

    try {
      setError(null);
      const addComment = type === 'movie'
        ? commentService.addMovieComment
        : commentService.addTvShowComment;

      await addComment(contentId, newComment.trim());
      setNewComment('');
      setIsCommentFormVisible(false);
      await fetchComments();
    } catch (err) {
      console.error('Yorum ekleme hatası:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!commentId) return;

    try {
      setError(null);
      await commentService.deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error('Yorum silme hatası:', err);
      setError(err.message);
    }
  };

  if (!contentId) {
    return <div className="comment-error">İçerik bulunamadı</div>;
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>Yorumlar</h3>
        {isAuthenticated && (
          <button 
            className="add-comment-button"
            onClick={() => setIsCommentFormVisible(!isCommentFormVisible)}
          >
            {isCommentFormVisible ? 'İptal' : 'Yorum Yap'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="comment-error">
          <p>{error}</p>
          <button onClick={fetchComments} className="retry-button">
            Tekrar Dene
          </button>
        </div>
      )}

      {isAuthenticated && isCommentFormVisible && (
        <div className="comment-form-container">
          <form onSubmit={handleSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              required
              disabled={loading}
              autoFocus
            />
            <div className="form-buttons">
              <button 
                type="button" 
                onClick={() => {
                  setIsCommentFormVisible(false);
                  setNewComment('');
                }}
                className="cancel-button"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading || !newComment.trim()}
                className="submit-button"
              >
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="comment-loading">
          <div className="loading-spinner"></div>
          <p>Yorumlar yükleniyor...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <img 
                    src={comment.user_avatar || '/default-avatar.png'} 
                    alt={comment.username}
                    className="user-avatar"
                  />
                  <span className="username">{comment.username}</span>
                </div>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              <p className="comment-content">{comment.content}</p>
              
              {user?.id === comment.user_id && (
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="delete-comment"
                  disabled={loading}
                >
                  {loading ? 'Siliniyor...' : 'Sil'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-comments">Henüz yorum yapılmamış.</p>
      )}

      {totalPages > 1 && (
        <div className="comment-pagination">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1 || loading}
          >
            Önceki
          </button>
          <span>Sayfa {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages || loading}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentSection; 