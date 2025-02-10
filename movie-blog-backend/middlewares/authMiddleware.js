const User = require('../models/user');

// Kullanıcı yetkilendirme middleware'i
const authorize = (role) => {
    return async (req, res, next) => {
        try {
            const userId = req.headers['user-id']; // Kullanıcı ID'sini header'dan alın
            if (!userId) {
                return res.status(403).json({ message: 'Access Denied: No User ID provided' });
            }

            const user = await User.findByPk(userId);
            if (!user || user.role !== role) {
                return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
            }

            next(); // Yetki uygun ise işlemi devam ettir
        } catch (error) {
            res.status(500).json({ message: 'Authorization error', error: error.message });
        }
    };
};

module.exports = { authorize };
