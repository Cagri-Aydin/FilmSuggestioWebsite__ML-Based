import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../../services/BlogService';
import './CreateBlog.css';

function CreateBlog() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: 1 // Varsayılan kategori
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Başlık ve içerik alanları zorunludur');
      }

      await blogService.createTopic(formData);
      navigate('/blog-page');
    } catch (err) {
      setError(err.message || 'Blog oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h1>Yeni Blog Oluştur</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">İçerik</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            disabled={loading}
            required
            rows={10}
          />
        </div>

        <button 
          type="submit" 
          className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Blog Oluştur'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog; 