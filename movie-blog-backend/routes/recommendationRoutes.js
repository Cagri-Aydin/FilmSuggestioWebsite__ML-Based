const express = require('express');
const router = express.Router();
const path = require('path');
const xlsx = require('xlsx');
const fetch = require('node-fetch');

// Tüm filmleri getiren endpoint
router.get('/movies', (req, res) => {
    try {
        // Excel dosyasının yolunu düzelt
        const workbook = xlsx.readFile(path.join(__dirname, '../../flask_recommendation_api/2000_Movies_Dataset.xlsx'));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const movies = xlsx.utils.sheet_to_json(sheet);
        
        console.log(`${movies.length} film başarıyla yüklendi`);
        res.json(movies);
    } catch (error) {
        console.error('Film listesi alınırken hata:', error);
        res.status(500).json({ 
            message: 'Filmler yüklenirken bir hata oluştu.', 
            error: error.message 
        });
    }
});

// Debug için test endpoint'i
router.get('/test', (req, res) => {
    res.json({ message: 'Recommendation routes çalışıyor' });
});

// Film önerisi endpoint'i
router.post('/recommend', async (req, res) => {
    try {
        const { selected_titles } = req.body;
        console.log('Backend: Seçilen filmler:', selected_titles);

        if (!selected_titles || selected_titles.length !== 3) {
            return res.status(400).json({
                message: 'Lütfen tam olarak 3 film seçin.'
            });
        }

        const flaskUrl = 'http://127.0.0.1:5001/recommend';
        console.log('Flask API isteği:', {
            url: flaskUrl,
            method: 'POST',
            body: { selected_titles }
        });

        const flaskResponse = await fetch(flaskUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selected_titles }),
        });

        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            console.error('Flask API hatası:', {
                status: flaskResponse.status,
                error: errorText
            });
            throw new Error(`Flask API yanıt kodu: ${flaskResponse.status}`);
        }

        const recommendations = await flaskResponse.json();
        console.log('Önerilen filmler:', recommendations);
        
        return res.json(recommendations);
    } catch (error) {
        console.error('Öneri alınırken hata:', error);
        return res.status(500).json({ 
            message: 'Film önerisi alınamadı.',
            error: error.message 
        });
    }
});

module.exports = router;
