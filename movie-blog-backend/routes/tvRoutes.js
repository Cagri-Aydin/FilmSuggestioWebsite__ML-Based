const express = require('express');
const router = express.Router();
const { tmdbApi, getImageUrl } = require('../config/tmdb');

// Popüler Diziler
router.get('/popular', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/tv/popular', { params: { page } });
        
        const shows = response.data.results.map(show => ({
            ...show,
            poster_path: getImageUrl.poster(show.poster_path),
            backdrop_path: getImageUrl.backdrop(show.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: shows
        });
    } catch (error) {
        console.error('Popüler diziler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'Popüler diziler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// Yayında Olan Diziler
router.get('/on-the-air', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/tv/on_the_air', { params: { page } });
        
        const shows = response.data.results.map(show => ({
            ...show,
            poster_path: getImageUrl.poster(show.poster_path),
            backdrop_path: getImageUrl.backdrop(show.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: shows
        });
    } catch (error) {
        console.error('Yayındaki diziler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'Yayındaki diziler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// En İyi Diziler
router.get('/top-rated', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await tmdbApi.get('/tv/top_rated', { params: { page } });
        
        const shows = response.data.results.map(show => ({
            ...show,
            poster_path: getImageUrl.poster(show.poster_path),
            backdrop_path: getImageUrl.backdrop(show.backdrop_path)
        }));

        res.json({
            ...response.data,
            results: shows
        });
    } catch (error) {
        console.error('En iyi diziler yüklenirken hata:', error);
        res.status(500).json({ 
            message: 'En iyi diziler yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

// TV Show Detayları
router.get('/detail/:id', async (req, res) => {
    try {
        // Türkçe dil desteği ile detayları al
        const [showResponse, videosResponse] = await Promise.all([
            tmdbApi.get(`/tv/${req.params.id}`, {
                params: {
                    language: 'tr-TR'  // Türkçe dil desteği
                }
            }),
            tmdbApi.get(`/tv/${req.params.id}/videos`, {
                params: {
                    language: 'tr-TR'
                }
            })
        ]);

        let allVideos = videosResponse.data.results || [];
        
        if (allVideos.length === 0) {
            const enVideosResponse = await tmdbApi.get(`/tv/${req.params.id}/videos`, {
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

        // Durum çevirisi
        const statusMap = {
            'Returning Series': 'Devam Ediyor',
            'In Production': 'Yapım Aşamasında',
            'Planned': 'Planlanıyor',
            'Canceled': 'İptal Edildi',
            'Ended': 'Final Yaptı',
            'Pilot': 'Pilot Bölüm'
        };

        // Tür çevirisi
        const typeMap = {
            'Scripted': 'Dizi',
            'Reality': 'Reality Show',
            'Documentary': 'Belgesel',
            'News': 'Haber',
            'Talk Show': 'Talk Show',
            'Miniseries': 'Mini Dizi'
        };

        // Bölüm süresi hesaplama
        const runTimes = showResponse.data.episode_run_time;
        let episodeRunTime = {
            average: null,
            formatted: 'Belirtilmemiş',
            all: []
        };

        if (runTimes && runTimes.length > 0) {
            const validTimes = runTimes.filter(time => time > 0);
            if (validTimes.length > 0) {
                const avg = Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);
                episodeRunTime = {
                    average: avg,
                    formatted: `${avg} dakika`,
                    all: validTimes
                };
            }
        }

        // Response data'yı hazırla
        const showData = {
            id: showResponse.data.id,
            name: showResponse.data.name,
            overview: showResponse.data.overview,
            first_air_date: showResponse.data.first_air_date,
            poster_path: getImageUrl.poster(showResponse.data.poster_path),
            backdrop_path: getImageUrl.backdrop(showResponse.data.backdrop_path),
            vote_average: showResponse.data.vote_average,
            
            // Durum bilgisi
            status: {
                original: showResponse.data.status,
                translated: statusMap[showResponse.data.status] || showResponse.data.status
            },

            // Tür bilgisi
            type: {
                original: showResponse.data.type,
                translated: typeMap[showResponse.data.type] || showResponse.data.type
            },
            
            // Ağ bilgileri
            networks: showResponse.data.networks?.map(network => ({
                id: network.id,
                name: network.name,
                logo_path: network.logo_path ? getImageUrl.poster(network.logo_path) : null
            })) || [],
            
            // Bölüm bilgileri
            episodeRunTime: episodeRunTime,
            
            // Sezon ve bölüm sayıları
            seasons: {
                count: showResponse.data.number_of_seasons || 0,
                episodes: showResponse.data.number_of_episodes || 0
            },

            // Türler
            genres: showResponse.data.genres || [],
            
            // Video ve fragman bilgileri
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

        res.json(showData);

    } catch (error) {
        console.error('Dizi detayları getirme hatası:', error);
        res.status(500).json({ 
            message: 'Dizi detayları yüklenirken hata oluştu', 
            error: error.message 
        });
    }
});

module.exports = router; 