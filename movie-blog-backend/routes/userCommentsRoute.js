const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Requesting comments for userId:', userId);

        // Database'deki yapıya uygun sorgu
        const comments = await sequelize.query(`
            SELECT 
                id,
                content,
                user_id,
                ref_type,
                ref_id,
                created_at,
                updated_at
            FROM comments 
            WHERE user_id = :userId
            ORDER BY created_at DESC
        `, {
            replacements: { userId },
            type: QueryTypes.SELECT
        });

        console.log('Found comments:', comments);

        // Yanıtı frontend'e uygun formata dönüştür
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            refType: comment.ref_type,
            refId: comment.ref_id,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at
        }));

        res.json(formattedComments);
    } catch (error) {
        console.error('Kullanıcı yorumları getirme hatası:', error);
        res.status(500).json({ 
            message: 'Yorumlar alınırken bir hata oluştu',
            error: error.message 
        });
    }
});

module.exports = router;