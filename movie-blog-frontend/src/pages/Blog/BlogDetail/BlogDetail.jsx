import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import { blogService } from '../../../services/BlogService';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogService.getTopicBySlug(id);
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!blog) return <div className="error">Blog yazısı bulunamadı.</div>;

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-header">
        <button onClick={() => navigate('/blog-page')} className="back-button">
          <i className="fas fa-arrow-left"></i> Geri
        </button>
        <h1>{blog.title}</h1>
      </div>

      <div className="blog-detail-meta">
        <div className="blog-author">
          <img 
            src={blog.author?.avatar || "https://via.placeholder.com/40"} 
            alt={blog.author?.username} 
            className="author-avatar"
          />
          <span>{blog.author?.username}</span>
        </div>
        <div className="blog-date">
          {formatDistance(new Date(blog.createdAt), new Date(), {
            addSuffix: true,
            locale: tr
          })}
        </div>
      </div>

      <div className="blog-content">
        {blog.content}
      </div>
    </div>
  );
}

export default BlogDetail; 