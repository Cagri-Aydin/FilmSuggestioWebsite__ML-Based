const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../config/database');

async function runMigrations() {
    const pool = new Pool(config);

    try {
        // SQL dosyasını oku
        const sqlPath = path.join(__dirname, '../migrations/forum_structure.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // SQL komutlarını çalıştır
        await pool.query(sql);

        console.log('Forum yapısı başarıyla oluşturuldu!');
    } catch (error) {
        console.error('Migration hatası:', error);
    } finally {
        await pool.end();
    }
}

runMigrations(); 