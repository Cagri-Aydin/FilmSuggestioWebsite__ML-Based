const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');

// Film yorumlarını getir
router.get('/movie/:movieId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;
        const movieId = req.params.movieId;

        // Önce tablo var mı kontrol et
        const [tableExists] = await sequelize.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'comments'
            );
        `);

        if (!tableExists[0].exists) {
            // Tablo yoksa oluştur
            await sequelize.query(`
                CREATE TABLE IF NOT EXISTS public.comments (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    ref_type VARCHAR(10) NOT NULL,
                    ref_id INTEGER NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
                );
            `);
            
            // Tablo yeni oluşturuldu, boş sonuç döndür
            return res.json({
                comments: [],
                total: 0,
                page,
                per_page,
                total_pages: 0
            });
        }

        // Yorumları getir
        const [comments] = await sequelize.query(`
            SELECT 
                c.id,
                c.content,
                c.user_id,
                u.username,
                u.avatar as user_avatar,
                c.created_at
            FROM public.comments c
            LEFT JOIN public.users u ON c.user_id = u.id
            WHERE c.ref_type = 'movie' AND c.ref_id = :movieId
            ORDER BY c.created_at DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: { 
                movieId,
                limit: per_page,
                offset: (page - 1) * per_page 
            }
        });

        const [totalResult] = await sequelize.query(`
            SELECT COUNT(*)::integer as total 
            FROM public.comments 
            WHERE ref_type = 'movie' AND ref_id = :movieId
        `, {
            replacements: { movieId }
        });

        const total = totalResult[0].total;

        res.json({
            comments,
            total,
            page,
            per_page,
            total_pages: Math.ceil(total / per_page)
        });

    } catch (error) {
        console.error('Yorumlar alınırken hata:', error);
        res.status(500).json({ 
            message: 'Yorumlar alınamadı',
            error: error.message 
        });
    }
});

// Film yorumu ekle
router.post('/movie/:movieId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const movieId = req.params.movieId;
        const userId = req.user.id;

        const [comment] = await sequelize.query(`
            INSERT INTO public.comments 
            (content, user_id, ref_type, ref_id, created_at, updated_at)
            VALUES (:content, :userId, 'movie', :movieId, NOW(), NOW())
            RETURNING 
                id,
                content,
                user_id,
                created_at
        `, {
            replacements: { content, userId, movieId }
        });

        res.status(201).json(comment[0]);

    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        res.status(500).json({ message: 'Yorum eklenemedi' });
    }
});

// Dizi yorumlarını getir
router.get('/tv/:tvId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;
        const tvId = req.params.tvId;

        const [comments] = await sequelize.query(`
            SELECT 
                c.id,
                c.content,
                c.user_id,
                u.username,
                u.avatar as user_avatar,
                c.created_at
            FROM public.comments c
            LEFT JOIN public.users u ON c.user_id = u.id
            WHERE c.ref_type = 'tv' AND c.ref_id = :tvId
            ORDER BY c.created_at DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: { 
                tvId,
                limit: per_page,
                offset: (page - 1) * per_page 
            }
        });

        const [totalResult] = await sequelize.query(`
            SELECT COUNT(*)::integer as total 
            FROM public.comments 
            WHERE ref_type = 'tv' AND ref_id = :tvId
        `, {
            replacements: { tvId }
        });

        const total = totalResult[0].total;

        res.json({
            comments,
            total,
            page,
            per_page,
            total_pages: Math.ceil(total / per_page)
        });

    } catch (error) {
        console.error('Yorumlar alınırken hata:', error);
        res.status(500).json({ message: 'Yorumlar alınamadı' });
    }
});

// Dizi yorumu ekle
router.post('/tv/:tvId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const tvId = req.params.tvId;
        const userId = req.user.id;

        const [comment] = await sequelize.query(`
            INSERT INTO public.comments 
            (content, user_id, ref_type, ref_id, created_at, updated_at)
            VALUES (:content, :userId, 'tv', :tvId, NOW(), NOW())
            RETURNING 
                id,
                content,
                user_id,
                created_at
        `, {
            replacements: { content, userId, tvId }
        });

        res.status(201).json(comment[0]);

    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        res.status(500).json({ message: 'Yorum eklenemedi' });
    }
});

// Yorum sil
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        const [comment] = await sequelize.query(`
            DELETE FROM public.comments 
            WHERE id = :commentId AND user_id = :userId
            RETURNING id
        `, {
            replacements: { commentId, userId }
        });

        if (!comment || comment.length === 0) {
            return res.status(404).json({ 
                message: 'Yorum bulunamadı veya silme yetkiniz yok' 
            });
        }

        res.json({ message: 'Yorum başarıyla silindi' });

    } catch (error) {
        console.error('Yorum silinirken hata:', error);
        res.status(500).json({ message: 'Yorum silinemedi' });
    }
});

module.exports = router; 