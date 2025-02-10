import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/BlogService';
import { useAuth } from '../../context/AuthContext';
import './BlogPage.css';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    perPage: 10
  });

  const { isAuthenticated } = useAuth();

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await blogService.getTopics({ page, per_page: pagination.perPage });
      
      setBlogs(response.blogs);
      setPagination({
        currentPage: response.page,
        totalPages: response.total_pages,
        totalBlogs: response.total,
        perPage: response.per_page
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="blog-loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="blog-error">Hata: {error}</div>;
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Blog Yazıları</h1>
        {isAuthenticated && (
          <Link to="/create-blog" className="create-blog-button">
            Yeni Blog Yaz
          </Link>
        )}
      </div>

      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <div className="blog-card-header">
              <div className="blog-author">
                <img 
                  src={blog.author_avatar || '/default-avatar.png'} 
                  alt={blog.author_username}
                  className="author-avatar"
                />
                <span className="author-name">{blog.author_username}</span>
              </div>
              <span className="blog-date">{formatDate(blog.created_at)}</span>
            </div>

            <Link to={`/blog/${blog.id}`} className="blog-title">
              <h2>{blog.title}</h2>
            </Link>

            <p className="blog-preview">
              {blog.content.substring(0, 200)}...
            </p>

            <div className="blog-card-footer">
              <div className="blog-stats">
                <span><i className="fas fa-eye"></i> {blog.view_count}</span>
                <span><i className="fas fa-comment"></i> {blog.message_count}</span>
              </div>
              <span className="last-activity">
                Son aktivite: {formatDate(blog.last_activity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Önceki
          </button>
          
          <span className="page-info">
            Sayfa {pagination.currentPage} / {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
