import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

// Sabit film kategorileri
const MOVIE_GENRES = [
  { id: 28, name: 'Aksiyon' },
  { id: 12, name: 'Macera' },
  { id: 16, name: 'Animasyon' },
  { id: 35, name: 'Komedi' },
  { id: 80, name: 'Suç' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Korku' },
  { id: 878, name: 'Bilim Kurgu' }
];

// Sabit dizi kategorileri
const TV_GENRES = [
  { id: 10759, name: 'Aksiyon & Macera' },
  { id: 16, name: 'Animasyon' },
  { id: 35, name: 'Komedi' },
  { id: 80, name: 'Suç' },
  { id: 18, name: 'Drama' },
  { id: 10765, name: 'Bilim Kurgu & Fantazi' },
  { id: 10768, name: 'Savaş & Politik' }
];

export const discoverService = {
  // Film kategorilerini al
  getMovieGenres: async () => {
    // API yerine sabit kategorileri döndür
    return MOVIE_GENRES;
  },

  // Dizi kategorilerini al
  getTVGenres: async () => {
    // API yerine sabit kategorileri döndür
    return TV_GENRES;
  },

  // Film keşfet
  discoverMovies: async ({
    sortBy = 'popularity.desc',
    year,
    genres,
    minRating,
    language = 'tr-TR'
  }) => {
    try {
      const totalPages = 5;
      const allResults = [];

      const promises = Array.from({ length: totalPages }, (_, i) => 
        axios.get(`${API_BASE_URL}/discover/movie`, {
          params: {
            page: i + 1,
            sort_by: sortBy,
            primary_release_year: year,
            with_genres: genres?.length ? genres.join(',') : undefined,
            'vote_average.gte': minRating,
            language
          }
        })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        if (response.data.results) {
          allResults.push(...response.data.results);
        }
      });

      return { results: allResults };
    } catch (error) {
      console.error('Film Keşfet Hatası:', error.response?.data || error.message);
      throw new Error('Filmler yüklenirken hata oluştu');
    }
  },

  // Dizi keşfet
  discoverTVShows: async ({
    sortBy = 'popularity.desc',
    year,
    genres,
    minRating,
    language = 'tr-TR'
  }) => {
    try {
      const totalPages = 5;
      const allResults = [];

      const promises = Array.from({ length: totalPages }, (_, i) => 
        axios.get(`${API_BASE_URL}/discover/tv`, {
          params: {
            page: i + 1,
            sort_by: sortBy,
            primary_release_year: year,
            with_genres: genres?.length ? genres.join(',') : undefined,
            'vote_average.gte': minRating,
            language
          }
        })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        if (response.data.results) {
          allResults.push(...response.data.results);
        }
      });

      return { results: allResults };
    } catch (error) {
      console.error('Dizi Keşfet Hatası:', error.response?.data || error.message);
      throw new Error('Diziler yüklenirken hata oluştu');
    }
  }
}; 