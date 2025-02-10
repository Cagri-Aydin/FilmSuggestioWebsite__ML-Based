import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// URL'i düzenleyen interceptor
instance.interceptors.request.use(request => {
  // İstekleri logla
  console.log('Giden istek:', {
    method: request.method,
    url: request.url,
    data: request.data
  });
  return request;
});

// Debug için response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Hatası:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default instance; 