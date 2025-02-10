import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api/comments';

export const commentService = {
  // Film yorumlarını getir
  getMovieComments: async (movieId, page = 1, per_page = 10) => {
    try {
      if (!movieId) throw new Error('Film ID gerekli');
      
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          page,
          per_page
        }
      });
      
      // Backend yanıtı kontrol
      if (!response.data || !Array.isArray(response.data.comments)) {
        throw new Error('Geçersiz yanıt formatı');
      }
      
      return {
        comments: response.data.comments,
        total: response.data.total || 0,
        page: response.data.page || 1,
        per_page: response.data.per_page || 10,
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error('Film yorumları alınamadı:', error);
      if (error.response?.status === 500) {
        throw new Error('Sunucu hatası: Yorumlar şu anda yüklenemiyor');
      }
      throw new Error(error.message || 'Yorumlar yüklenemedi');
    }
  },

  // Dizi yorumlarını getir
  getTvShowComments: async (tvShowId, page = 1, per_page = 10) => {
    try {
      if (!tvShowId) throw new Error('Dizi ID gerekli');
      
      const response = await axios.get(`${BASE_URL}/tv/${tvShowId}`, {
        params: {
          page,
          per_page
        }
      });
      
      // Backend yanıtı kontrol
      if (!response.data || !Array.isArray(response.data.comments)) {
        throw new Error('Geçersiz yanıt formatı');
      }
      
      return {
        comments: response.data.comments,
        total: response.data.total || 0,
        page: response.data.page || 1,
        per_page: response.data.per_page || 10,
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error('Dizi yorumları alınamadı:', error);
      if (error.response?.status === 500) {
        throw new Error('Sunucu hatası: Yorumlar şu anda yüklenemiyor');
      }
      throw new Error(error.message || 'Yorumlar yüklenemedi');
    }
  },

  // Film yorumu ekle
  addMovieComment: async (movieId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Yorum yapmak için giriş yapmalısınız');
      }

      const response = await axios.post(`${BASE_URL}/movie/${movieId}`, 
        { content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
      throw new Error(error.response?.data?.message || 'Yorum eklenemedi');
    }
  },

  // Dizi yorumu ekle
  addTvShowComment: async (tvShowId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Yorum yapmak için giriş yapmalısınız');
      }

      const response = await axios.post(`${BASE_URL}/tv/${tvShowId}`, 
        { content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
      throw new Error(error.response?.data?.message || 'Yorum eklenemedi');
    }
  },

  // Yorum sil
  deleteComment: async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bu işlem için giriş yapmalısınız');
      }

      await axios.delete(`${BASE_URL}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Yorum silinemedi:', error);
      throw new Error(error.response?.data?.message || 'Yorum silinemedi');
    }
  }
};

// Axios interceptor - hata yakalama
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 