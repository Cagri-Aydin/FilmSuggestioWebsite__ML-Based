const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// Kullanıcı profili getirme
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Requested userId:', userId);

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'avatar', 'created_at']
        });

        if (!user) {
            return res.status(404).json({ 
                message: 'Kullanıcı bulunamadı',
                requestedId: userId 
            });
        }

        console.log('Found user:', user.toJSON());
        res.json(user);
    } catch (error) {
        console.error('Profil getirme hatası:', error);
        res.status(500).json({ 
            message: 'Profil bilgileri alınırken bir hata oluştu',
            error: error.message 
        });
    }
});

// Profil güncelleme (authentication gerekli)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Kullanıcının kendi profilini güncellemesini sağla
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ 
                message: 'Bu profili güncelleme yetkiniz yok' 
            });
        }

        const { username, email, avatar } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ 
                message: 'Kullanıcı bulunamadı' 
            });
        }

        // Güncelleme işlemi
        await user.update({
            username,
            email,
            avatar
        });

        res.json({
            message: 'Profil başarıyla güncellendi',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ 
            message: 'Profil güncellenirken bir hata oluştu',
            error: error.message 
        });
    }
});

module.exports = router;
