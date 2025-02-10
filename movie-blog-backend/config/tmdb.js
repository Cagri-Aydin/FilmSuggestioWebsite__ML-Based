require('dotenv').config();

const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Axios instance oluştur
const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR'
    }
});

// Resim URL'lerini oluşturmak için yardımcı fonksiyonlar
const getImageUrl = {
    poster: (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : null,
    backdrop: (path) => path ? `https://image.tmdb.org/t/p/original${path}` : null
};

// İstek öncesi middleware
tmdbApi.interceptors.request.use(config => {
    // URL'in doğru formatta olduğundan emin ol
    if (config.url.startsWith('/3/')) {
        config.url = config.url.replace('/3/', '/');
    }
    return config;
});

// İstek sonrası middleware
tmdbApi.interceptors.response.use(
    response => response,
    error => {
        console.error('TMDB API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

module.exports = { tmdbApi, getImageUrl }; 