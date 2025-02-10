const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kullanıcı işlemleri
router.post('/', createUser); // Yeni kullanıcı oluştur
router.get('/', getUsers); // Tüm kullanıcıları getir
router.get('/:id', getUserById); // Belirli bir kullanıcıyı getir
router.put('/:id', updateUser); // Kullanıcı bilgilerini güncelle
router.delete('/:id', deleteUser); // Kullanıcıyı sil

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluştur
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    try {
        console.log('Login Request Body:', req.body);
        const { username, email, password } = req.body;

        if (!password || (!email && !username)) {
            return res.status(400).json({ 
                message: 'Kullanıcı adı/email ve şifre zorunludur',
                receivedData: req.body 
            });
        }

        // Kullanıcıyı email veya username ile bul
        const user = await User.findOne({ 
            where: email ? { email } : { username }
        });

        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı adı/email veya şifre hatalı' });
        }

        // Şifreyi kontrol et
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Kullanıcı adı/email veya şifre hatalı' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username,
                email: user.email,
                role: user.role 
            },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ 
            message: 'Sunucu hatası', 
            error: error.message,
            receivedData: req.body
        });
    }
});

// Kullanıcı profili
router.get('/profile', async (req, res) => {
    try {
        // Token kontrolü yapılacak
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token bulunamadı' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Profil hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
