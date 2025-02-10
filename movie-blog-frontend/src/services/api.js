import axios from 'axios';

// API temel URL'sini ayarla
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Axios instance oluştur
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor ekle
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export const movieService = {
    // Film servisleri
    getPopularMovies: (page = 1) => 
        apiClient.get(`/api/movies/popular?page=${page}`),
    
    getNowPlayingMovies: (page = 1) => 
        apiClient.get(`/api/movies/now-playing?page=${page}`),
    
    getUpcomingMovies: (page = 1) => 
        apiClient.get(`/api/movies/upcoming?page=${page}`),
    
    getTopRatedMovies: (page = 1) => 
        apiClient.get(`/api/movies/top-rated?page=${page}`),
    
    getMovieDetails: (id) => 
        apiClient.get(`/api/movies/detail/${id}`),

    // TV Show servisleri
    getPopularTvShows: (page = 1) => 
        apiClient.get(`/api/tv/popular?page=${page}`),
    
    getOnTheAirTvShows: (page = 1) => 
        apiClient.get(`/api/tv/on-the-air?page=${page}`),
    
    getTopRatedTvShows: (page = 1) => 
        apiClient.get(`/api/tv/top-rated?page=${page}`),
    
    getTvShowDetails: (id) => 
        apiClient.get(`/api/tv/detail/${id}`),

    // Diğer servisler
    searchMovies: (query, page = 1) => 
        apiClient.get(`/api/movies/search?query=${query}&page=${page}`),
    
    getGenres: () => 
        apiClient.get('/api/movies/genres'),
    
    getMoviesByGenre: (genreId, page = 1) => 
        apiClient.get(`/api/movies/genre/${genreId}?page=${page}`),
    
    getMovieVideos: (movieId) => 
        apiClient.get(`/api/movies/detail/${movieId}/videos`),
    
    getMovieBlogs: (movieId) => 
        apiClient.get(`/api/blogs/movie/${movieId}`)
};

// Blog servisleri
export const blogService = {
    getAllBlogs: () => apiClient.get('/api/blogs'),
    getBlogById: (id) => apiClient.get(`/api/blogs/${id}`),
    createBlog: (data) => apiClient.post('/api/blogs', data),
    updateBlog: (id, data) => apiClient.put(`/api/blogs/${id}`, data),
    deleteBlog: (id) => apiClient.delete(`/api/blogs/${id}`)
};

export { API_BASE_URL };
export default apiClient; 