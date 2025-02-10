import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api/blog';

// Request interceptor - her istekte token ekle
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const blogService = {
  // Blog listesi getir
  getTopics: async (params = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/all`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10
        }
      });
      
      // Backend'den gelen response formatı:
      // { blogs: [...], total: number, page: number, per_page: number, total_pages: number }
      return response.data;
    } catch (error) {
      console.error('Blog listesi alınamadı:', error);
      throw new Error(error.response?.data?.message || 'Bloglar yüklenirken bir hata oluştu');
    }
  },

  // Yeni blog oluştur
  createTopic: async (blogData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, {
        title: blogData.title,
        content: blogData.content,
        category_id: blogData.category_id || 1
      });
      return response.data;
    } catch (error) {
      console.error('Blog oluşturulamadı:', error);
      if (error.response?.status === 401) {
        throw new Error('Blog oluşturmak için giriş yapmalısınız');
      }
      throw new Error(error.response?.data?.message || 'Blog oluşturulurken bir hata oluştu');
    }
  },

  // Blog detayı getir
  getTopicById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Blog detayı alınamadı:', error);
      throw new Error(error.response?.data?.message || 'Blog detayı yüklenirken bir hata oluştu');
    }
  },

  // Blog güncelle
  updateTopic: async (id, blogData) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, {
        title: blogData.title,
        content: blogData.content,
        category_id: blogData.category_id || 1
      });
      return response.data;
    } catch (error) {
      console.error('Blog güncellenemedi:', error);
      throw new Error(error.response?.data?.message || 'Blog güncellenirken bir hata oluştu');
    }
  },

  // Blog sil
  deleteTopic: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error('Blog silinemedi:', error);
      throw new Error(error.response?.data?.message || 'Blog silinirken bir hata oluştu');
    }
  },

  // Blog'a yorum ekle
  addComment: async (blogId, comment) => {
    try {
      const response = await axios.post(`${BASE_URL}/${blogId}/comment`, {
        content: comment
      });
      return response.data;
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
      throw new Error(error.response?.data?.message || 'Yorum eklenirken bir hata oluştu');
    }
  },

  // Blog'un yorumlarını getir
  getComments: async (blogId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${blogId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Yorumlar alınamadı:', error);
      throw new Error(error.response?.data?.message || 'Yorumlar yüklenirken bir hata oluştu');
    }
  }
}; 