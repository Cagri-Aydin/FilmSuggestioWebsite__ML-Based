const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Email ve username kontrolü
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Bu email veya kullanıcı adı zaten kullanımda'
            });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcı oluştur
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Token oluştur
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({
            message: 'Kayıt işlemi başarısız',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: 'Email veya şifre hatalı'
            });
        }

        // Şifreyi kontrol et
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Email veya şifre hatalı'
            });
        }

        // Token oluştur
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({
            message: 'Giriş işlemi başarısız',
            error: error.message
        });
    }
});

// Kullanıcı bilgilerini getir
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'avatar']
        });
        res.json(user);
    } catch (error) {
        console.error('Kullanıcı bilgileri getirme hatası:', error);
        res.status(500).json({
            message: 'Kullanıcı bilgileri alınamadı',
            error: error.message
        });
    }
});

// Profil güncelleme
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { username, email, avatar } = req.body;
        const user = await User.findByPk(req.user.id);

        // Güncelleme
        await user.update({
            username: username || user.username,
            email: email || user.email,
            avatar: avatar || user.avatar
        });

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        });

    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({
            message: 'Profil güncellenemedi',
            error: error.message
        });
    }
});

// Şifre değiştirme
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // Mevcut şifreyi kontrol et
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Mevcut şifre hatalı'
            });
        }

        // Yeni şifreyi hashle ve güncelle
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.json({ message: 'Şifre başarıyla güncellendi' });

    } catch (error) {
        console.error('Şifre değiştirme hatası:', error);
        res.status(500).json({
            message: 'Şifre değiştirilemedi',
            error: error.message
        });
    }
});

module.exports = router; 