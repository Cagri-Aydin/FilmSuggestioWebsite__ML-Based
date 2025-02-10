const express = require('express');
const router = express.Router();
const { tmdbApi, getImageUrl } = require('../config/tmdb');

// Popüler Filmler
router.get('/popular', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/movie/popular', { params: { page } });
        
        const movies = response.data.results.map(movie => ({
            ...movie,
            poster_path: getImageUrl.poster(movie.poster_path),
            backdrop_path: getImageUrl.backdrop(movie.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: movies
        });
    } catch (error) {
        console.error('Popüler filmler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'Popüler filmler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// Vizyondaki Filmler
router.get('/now-playing', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
        
        const movies = response.data.results.map(movie => ({
            ...movie,
            poster_path: getImageUrl.poster(movie.poster_path),
            backdrop_path: getImageUrl.backdrop(movie.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: movies
        });
    } catch (error) {
        console.error('Vizyondaki filmler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'Vizyondaki filmler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// Yakında Gelecek Filmler
router.get('/upcoming', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
        
        const movies = response.data.results.map(movie => ({
            ...movie,
            poster_path: getImageUrl.poster(movie.poster_path),
            backdrop_path: getImageUrl.backdrop(movie.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: movies
        });
    } catch (error) {
        console.error('Yakında gelecek filmler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'Yakında gelecek filmler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// En İyi Filmler
router.get('/top-rated', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
        
        const movies = response.data.results.map(movie => ({
            ...movie,
            poster_path: getImageUrl.poster(movie.poster_path),
            backdrop_path: getImageUrl.backdrop(movie.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: movies
        });
    } catch (error) {
        console.error('En iyi filmler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'En iyi filmler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// Film Detayları
router.get('/detail/:id', async (req, res) => {
    try {
        const [movieResponse, videosResponse] = await Promise.all([
            tmdbApi.get(`/movie/${req.params.id}`),
            tmdbApi.get(`/movie/${req.params.id}/videos`, {
                params: {
                    language: 'tr-TR'
                }
            })
        ]);

        let allVideos = videosResponse.data.results || [];
        
        if (allVideos.length === 0) {
            const enVideosResponse = await tmdbApi.get(`/movie/${req.params.id}/videos`, {
                params: {
                    language: 'en-US'
                }
            });
            allVideos = enVideosResponse.data.results || [];
        }

        // Trailer bulma stratejisi
        let trailer = null;
        const trailerPriority = [
            video => video.type === "Trailer" && video.site === "YouTube" && video.iso_639_1 === "tr",
            video => video.type === "Teaser" && video.site === "YouTube" && video.iso_639_1 === "tr",
            video => video.type === "Trailer" && video.site === "YouTube" && video.iso_639_1 === "en",
            video => video.type === "Teaser" && video.site === "YouTube" && video.iso_639_1 === "en",
            video => video.site === "YouTube"
        ];

        for (const findStrategy of trailerPriority) {
            trailer = allVideos.find(findStrategy);
            if (trailer) break;
        }

        const movieData = {
            ...movieResponse.data,
            poster_path: getImageUrl.poster(movieResponse.data.poster_path),
            backdrop_path: getImageUrl.backdrop(movieResponse.data.backdrop_path),
            videos: allVideos.filter(video => video.site === "YouTube").map(video => ({
                key: video.key,
                site: video.site,
                type: video.type,
                name: video.name,
                language: video.iso_639_1
            })),
            trailer: trailer ? {
                key: trailer.key,
                site: trailer.site,
                type: trailer.type,
                name: trailer.name,
                language: trailer.iso_639_1
            } : null,
            hasTrailer: !!trailer
        };

        res.json(movieData);

    } catch (error) {
        console.error('Film detayları getirme hatası:', error);
        res.status(500).json({ 
            message: 'Film detayları yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// Arama endpoint'i
router.get('/search', async (req, res) => {
    try {
        const { query, page = 1 } = req.query;

        if (!query) {
            return res.status(400).json({
                message: 'Arama terimi gerekli'
            });
        }

        // Multi-search endpoint'ini kullan (film ve dizileri birlikte ara)
        const response = await tmdbApi.get('/search/multi', {
            params: {
                query,
                page,
                language: 'tr-TR', // Türkçe sonuçlar için
                include_adult: false // Yetişkin içeriği hariç tut
            }
        });

        // Sonuçları formatla
        const results = response.data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .map(item => ({
                id: item.id,
                title: item.title || null, // Filmler için
                name: item.name || null,   // Diziler için
                media_type: item.media_type,
                poster_path: item.poster_path ? getImageUrl.poster(item.poster_path) : null,
                backdrop_path: item.backdrop_path ? getImageUrl.backdrop(item.backdrop_path) : null,
                overview: item.overview || '',
                vote_average: item.vote_average || 0,
                release_date: item.release_date || null,     // Filmler için
                first_air_date: item.first_air_date || null // Diziler için
            }));

        res.json({
            page: response.data.page,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
            results
        });

    } catch (error) {
        console.error('Arama hatası:', error);
        res.status(500).json({ 
            message: 'Arama yapılırken hata oluştu', 
            error: error.message 
        });
    }
});

module.exports = router;
