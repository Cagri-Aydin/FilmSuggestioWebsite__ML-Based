const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Debug için tüm istekleri logla
router.use((req, res, next) => {
    console.log('Discover isteği:', {
        path: req.path,
        query: req.query
    });
    next();
});

// Ortak discover fonksiyonu
async function discoverMedia(type, queryParams) {
    try {
        console.log(`TMDB ${type} isteği yapılıyor:`, queryParams);

        const response = await axios.get(`${TMDB_BASE_URL}/discover/${type}`, {
            params: {
                api_key: TMDB_API_KEY,
                page: queryParams.page || 1,
                per_page: 40,
                sort_by: queryParams.sort_by || 'popularity.desc',
                ...(queryParams.primary_release_year && { 
                    [type === 'movie' ? 'primary_release_year' : 'first_air_date_year']: 
                    queryParams.primary_release_year 
                }),
                with_genres: queryParams.with_genres || '',
                'vote_average.gte': queryParams.vote_average_gte || 0,
                language: queryParams.language || 'tr-TR',
                include_adult: false,
                include_video: false,
                with_watch_monetization_types: 'flatrate'
            }
        });

        const totalPages = response.data.total_pages;
        let allResults = [...response.data.results];

        const maxPages = Math.min(totalPages, 5);
        
        for(let page = 2; page <= maxPages; page++) {
            const nextResponse = await axios.get(`${TMDB_BASE_URL}/discover/${type}`, {
                params: {
                    ...response.config.params,
                    page: page
                }
            });
            allResults = [...allResults, ...nextResponse.data.results];
        }

        return {
            ...response.data,
            results: allResults,
            total_results: allResults.length,
            total_pages: maxPages
        };

    } catch (error) {
        console.error(`TMDB ${type} hatası:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.status_message || `${type} listesi alınamadı`);
    }
}

// GET /api/discover/movie
router.get('/movie', async (req, res) => {
    try {
        console.log('Film discover isteği:', req.query);

        const result = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                page: req.query.page || 1,
                sort_by: req.query.sort_by || 'popularity.desc',
                year: req.query.primary_release_year,
                with_genres: req.query.with_genres || '',
                'vote_average.gte': req.query['vote_average.gte'] || 0,
                language: req.query.language || 'tr-TR',
                include_adult: false,
                include_video: false,
                with_watch_monetization_types: 'flatrate'
            }
        });

        console.log('TMDB yanıtı:', {
            total_results: result.data.total_results,
            total_pages: result.data.total_pages
        });

        res.json(result.data);

    } catch (error) {
        console.error('Film discover hatası:', error.response?.data || error);
        res.status(500).json({ 
            message: 'Film listesi alınamadı',
            error: error.response?.data?.status_message || error.message 
        });
    }
});

// GET /api/discover/tv
router.get('/tv', async (req, res) => {
    try {
        const result = await discoverMedia('tv', {
            page: req.query.page,
            sort_by: req.query.sort_by,
            primary_release_year: req.query.primary_release_year,
            with_genres: req.query.with_genres,
            vote_average_gte: req.query['vote_average.gte'],
            language: req.query.language
        });

        res.json(result);

    } catch (error) {
        console.error('Dizi discover hatası:', error);
        res.status(500).json({ 
            message: 'Dizi listesi alınamadı',
            error: error.message 
        });
    }
});

// Film kategorilerini getir
router.get('/movie/genres', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
                api_key: TMDB_API_KEY,
                language: req.query.language || 'tr-TR'
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Film kategorileri alınırken hata:', error);
        res.status(500).json({ 
            message: 'Film kategorileri alınamadı',
            error: error.message 
        });
    }
});

// Dizi kategorilerini getir
router.get('/tv/genres', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
            params: {
                api_key: TMDB_API_KEY,
                language: req.query.language || 'tr-TR'
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Dizi kategorileri alınırken hata:', error);
        res.status(500).json({ 
            message: 'Dizi kategorileri alınamadı',
            error: error.message 
        });
    }
});

module.exports = router; 