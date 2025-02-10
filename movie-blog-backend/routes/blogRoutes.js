const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');

// Debug için tüm route'ları logla
router.use((req, res, next) => {
    console.log('İstek geldi:', {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body
    });
    next();
});

// GET /api/blog/all - Tüm blogları listele (en üstte olmalı)
router.get('/all', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        
        console.log('Blog listesi istendi:', { limit, page, offset });

        // View'dan blog listesini al
        const [blogs] = await sequelize.query(`
            SELECT * FROM public.v_topic_summary 
            ORDER BY last_activity DESC 
            LIMIT :limit OFFSET :offset
        `, {
            replacements: { limit, offset }
        });

        // Toplam blog sayısını al
        const [totalResult] = await sequelize.query(`
            SELECT COUNT(*)::integer as total FROM public.topics
        `);
        const total = totalResult[0].total || 0;

        const response = {
            blogs,
            total,
            page,
            per_page: limit,
            total_pages: Math.ceil(total / limit)
        };

        console.log('Blog listesi gönderiliyor:', response);
        res.json(response);

    } catch (error) {
        console.error('Blog listesi alınırken hata:', error);
        res.status(500).json({ 
            message: 'Blog listesi alınamadı', 
            error: error.message 
        });
    }
});

// POST /api/blog - Blog oluştur
router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('Blog oluşturma isteği:', req.body);

        const { title, content } = req.body;
        const author_id = req.user.id;

        const [blog] = await sequelize.query(`
            SELECT * FROM public.sp_create_topic(
                :title,
                :content,
                :author_id,
                1,  -- Varsayılan kategori ID'si
                NULL -- Şimdilik tag yok
            );
        `, {
            replacements: {
                title,
                content,
                author_id
            }
        });

        console.log('Blog oluşturuldu:', blog[0]);
        res.status(201).json(blog[0]);

    } catch (error) {
        console.error('Blog oluşturulurken hata:', error);
        res.status(500).json({ 
            message: 'Blog oluşturulamadı', 
            error: error.message 
        });
    }
});

// GET /api/blog/:id - Blog detayı (en sonda olmalı)
router.get('/:id', async (req, res) => {
    try {
        console.log('Blog detayı istendi:', req.params);

        const [blog] = await sequelize.query(`
            SELECT * FROM public.v_topic_summary 
            WHERE id = :id
        `, {
            replacements: { id: req.params.id }
        });

        if (!blog || blog.length === 0) {
            console.log('Blog bulunamadı:', req.params.id);
            return res.status(404).json({ 
                message: 'Blog bulunamadı' 
            });
        }

        console.log('Blog detayı gönderiliyor:', blog[0]);
        res.json(blog[0]);

    } catch (error) {
        console.error('Blog detayı alınırken hata:', error);
        res.status(500).json({ 
            message: 'Blog detayı alınamadı', 
            error: error.message 
        });
    }
});

// POST /api/blog/create - Blog oluştur
router.post('/create', authMiddleware, async (req, res) => {
    try {
        console.log('Blog oluşturma isteği:', req.body);

        const { title, content } = req.body;
        const author_id = req.user?.id || 1; // Geçici olarak 1 kullanıyoruz

        // Direkt olarak blog oluştur
        const [blog] = await sequelize.query(`
            SELECT * FROM public.sp_create_topic(
                :title,
                :content,
                :author_id,
                1,  -- Varsayılan kategori ID'si
                NULL -- Şimdilik tag yok
            );
        `, {
            replacements: {
                title,
                content,
                author_id
            }
        });

        if (blog && blog.length > 0) {
            console.log('Blog oluşturuldu:', blog[0]);
            res.status(201).json(blog[0]);
        } else {
            throw new Error('Blog oluşturulamadı');
        }

    } catch (error) {
        console.error('Blog oluşturulurken hata:', error);
        res.status(500).json({ 
            message: 'Blog oluşturulamadı', 
            error: error.message 
        });
    }
});

module.exports = router;
