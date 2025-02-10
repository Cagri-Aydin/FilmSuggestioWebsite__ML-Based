require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/user');
const Movie = require('./models/movie');
const Blog = require('./models/blog');
const Topic = require('./models/Topic');
const Category = require('./models/category');
const TopicTag = require('./models/TopicTag');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Message = require('./models/Message');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const discoverRoutes = require('./routes/discoverRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const profileRoutes = require('./routes/profilePageRoutes');
const userCommentsRoutes = require('./routes/userCommentsRoute');

const app = express();

// CORS ayarları
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pre-flight istekleri için OPTIONS
app.options('*', cors());

// Route'ları import et
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const tvRoutes = require('./routes/tvRoutes');
const searchRoutes = require('./routes/searchRoutes'); // Yeni search router
const blogRoutes = require('./routes/blogRoutes');
const viewRoutes = require('./routes/viewRoutes');
const adminViewRoutes = require('./routes/adminViewRoutes');

// API rotaları
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/search', searchRoutes); // Yeni search endpoint'i
app.use('/api/blog', blogRoutes);
app.use('/views', viewRoutes);
app.use('/admin', adminViewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user-comments', userCommentsRoutes);

// API test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'API çalışıyor',
        endpoints: {
            search: '/api/search?query=:searchQuery&page=:page',
            movies: '/api/movies/*',
            tv: '/api/tv/*',
            users: '/api/users/*',
            blogs: '/api/blogs/*'
        }
    });
});

// Hata yakalama middleware
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({ 
        message: 'Bir hata oluştu!',
        error: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Sayfa bulunamadı:', req.path);
    res.status(404).json({
        message: 'Sayfa bulunamadı!',
        path: req.path
    });
});

// Model ilişkileri
Topic.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Topic.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Topic.hasMany(TopicTag, { foreignKey: 'topic_id', as: 'tags' });
Topic.hasMany(Message, { foreignKey: 'topic_id', as: 'messages' });

Category.hasMany(Topic, { foreignKey: 'category_id', as: 'topics' });

User.hasMany(Topic, { foreignKey: 'author_id', as: 'topics' });
User.hasMany(Message, { foreignKey: 'author_id', as: 'messages' });

Message.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });
Message.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Blog.belongsTo(User, { 
    foreignKey: 'author_id', 
    as: 'author' 
});

User.hasMany(Blog, { 
    foreignKey: 'author_id', 
    as: 'blogs' 
});

// Database senkronizasyonu ve migration'lar
(async () => {
    try {
        // 1. Tüm tabloları temizle
        await sequelize.query(`
            DROP VIEW IF EXISTS public.v_topic_summary CASCADE;
            DROP FUNCTION IF EXISTS public.fn_get_topic_slug(TEXT) CASCADE;
            DROP FUNCTION IF EXISTS public.sp_create_topic(TEXT, TEXT, INTEGER, INTEGER, JSON) CASCADE;
            DROP FUNCTION IF EXISTS public.fn_update_topic_activity() CASCADE;
            DROP TABLE IF EXISTS public.topic_tags CASCADE;
            DROP TABLE IF EXISTS public.topics CASCADE;
            DROP TABLE IF EXISTS public.messages CASCADE;
            DROP TABLE IF EXISTS public.categories CASCADE;
        `);
        
        console.log('Tüm tablolar temizlendi');

        // 2. Tüm tabloları senkronize et (force: false)
        await sequelize.sync({ alter: false });
        console.log('Tablolar senkronize edildi');

        // 3. Categories tablosunu oluştur ve varsayılan kategoriyi ekle
        await sequelize.query(`
            INSERT INTO public.categories (id, name, slug, created_at, updated_at)
            VALUES (1, 'Genel', 'genel', NOW(), NOW())
            ON CONFLICT (id) DO UPDATE 
            SET name = EXCLUDED.name
            RETURNING id, name;
        `);

        console.log('Varsayılan kategori oluşturuldu/güncellendi');

        // 4. View ve fonksiyonları oluştur
        const sqlPath = path.join(__dirname, 'migrations/forum_structure.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await sequelize.query(sql);
            console.log('Forum yapısı başarıyla oluşturuldu');
        }

    } catch (error) {
        console.error('Veritabanı işlemleri sırasında hata:', error);
        process.exit(1);
    }
})();

// Server başlat
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});

module.exports = app;

