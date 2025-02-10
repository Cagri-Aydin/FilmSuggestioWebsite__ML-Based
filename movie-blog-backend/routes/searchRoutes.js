const express = require('express');
const router = express.Router();
const { tmdbApi, getImageUrl } = require('../config/tmdb');

// Genel arama endpoint'i (film ve dizi)
router.get('/', async (req, res) => {
    try {
        const { query, page = 1 } = req.query;

        if (!query) {
            return res.status(400).json({
                message: 'Arama terimi gerekli'
            });
        }

        const response = await tmdbApi.get('/search/multi', {
            params: {
                query,
                page,
                language: 'tr-TR',
                include_adult: false
            }
        });

        const results = response.data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .map(item => ({
                id: item.id,
                title: item.title || item.name, // Film veya dizi adı
                name: item.name || item.title,  // Dizi veya film adı
                media_type: item.media_type,
                poster_path: item.poster_path ? getImageUrl.poster(item.poster_path) : null,
                backdrop_path: item.backdrop_path ? getImageUrl.backdrop(item.backdrop_path) : null,
                overview: item.overview || '',
                vote_average: item.vote_average || 0,
                release_date: item.release_date || item.first_air_date || null,
                first_air_date: item.first_air_date || item.release_date || null
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