const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Yetkilendirme token\'ı gerekli' 
            });
        }

        // Token'ı ayır ve doğrula
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcıyı bul
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'email', 'avatar']
        });

        if (!user) {
            return res.status(401).json({ 
                message: 'Kullanıcı bulunamadı' 
            });
        }

        // Kullanıcı bilgisini request'e ekle
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Geçersiz token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token süresi dolmuş' 
            });
        }
        console.error('Auth middleware hatası:', error);
        res.status(500).json({ 
            message: 'Yetkilendirme hatası',
            error: error.message 
        });
    }
};

module.exports = authMiddleware; 