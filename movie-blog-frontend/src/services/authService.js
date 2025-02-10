import axios from 'axios';

const API_URL = 'http://localhost:5050/api/auth';

export const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data.message.includes('email')) {
          throw new Error('Bu email adresi zaten kullanımda');
        }
        if (error.response.data.message.includes('username')) {
          throw new Error('Bu kullanıcı adı zaten kullanımda');
        }
        if (error.response.data.message.includes('password')) {
          throw new Error('Şifre en az 6 karakter olmalıdır');
        }
      }
      throw error.response?.data?.message || 'Kayıt işlemi başarısız oldu';
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Giriş işlemi başarısız oldu';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error.response?.data?.message || 'Kullanıcı bilgileri alınamadı';
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put(`${API_URL}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Şifre güncellenemedi';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, {
        username: profileData.username,
        email: profileData.email,
        avatar: profileData.avatar
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Profil güncellenemedi';
    }
  }
};

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