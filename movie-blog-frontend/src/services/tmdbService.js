import axios from 'axios';

const API_BASE_URL = '/api';

export const tmdbService = {
  // Film keşfet
  discoverMovies: async ({
    page = 1,
    sortBy = 'popularity.desc',
    year,
    genres = [], // Default boş dizi
    minRating,
    language = 'tr-TR'
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discover/movie`, {
        params: {
          page,
          sort_by: sortBy,
          primary_release_year: year,
          with_genres: genres.length ? genres.join(',') : undefined, // Null check
          'vote_average.gte': minRating,
          language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Film Keşfet Hatası:', error.response?.data || error.message);
      throw new Error('Filmler yüklenirken hata oluştu');
    }
  },

  // Dizi keşfet
  discoverTVShows: async ({
    page = 1,
    sortBy = 'vote_average.desc',
    year,
    genres = [], // Default boş dizi
    minRating,
    language = 'tr-TR'
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discover/tv`, {
        params: {
          page,
          sort_by: sortBy,
          primary_release_year: year,
          with_genres: genres.length ? genres.join(',') : undefined, // Null check
          'vote_average.gte': minRating,
          language
        }
      });
      return response.data;
    } catch (error) {
      console.error('Dizi Keşfet Hatası:', error.response?.data || error.message);
      throw new Error('Diziler yüklenirken hata oluştu');
    }
  }
}; 