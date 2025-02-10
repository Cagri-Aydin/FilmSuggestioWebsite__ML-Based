import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import './RecommendationPage.css';

const RecommendationPage = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedTitles, setSelectedTitles] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/recommendations/movies');
                setMovies(response.data);

                // Extract unique categories from the movies
                const genres = [...new Set(response.data.map(movie => movie.Genre))];
                setCategories(genres);

                setFilteredMovies(response.data);
                setError(null);
            } catch (err) {
                console.error('Filmler yüklenirken hata:', err);
                setError('Filmler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleSelection = (title) => {
        if (selectedTitles.includes(title)) {
            setSelectedTitles(selectedTitles.filter(t => t !== title));
        } else if (selectedTitles.length < 3) {
            setSelectedTitles([...selectedTitles, title]);
        }
    };

    const getRecommendations = async () => {
        try {
            console.log('Seçilen filmler:', selectedTitles);
            
            if (!selectedTitles || selectedTitles.length !== 3) {
                setError('Lütfen tam olarak 3 film seçin.');
                return;
            }

            const response = await axios.post('/recommendations/recommend', {
                selected_titles: selectedTitles
            });

            console.log('API Yanıtı:', response.data);
            
            if (response.data) {
                setRecommendations(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Öneri alınırken hata:', err);
            setError('Öneri alınamadı. Hata: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);

        if (category === '') {
            setFilteredMovies(movies);
        } else {
            setFilteredMovies(movies.filter(movie => movie.Genre === category));
        }
    };

    return (
        <div className="recommendation-page">
            <h1>Film Önerisi</h1>
            <h2>Film Seç (En fazla 3 film seçebilirsiniz)</h2>

            {loading && <div>Filmler yükleniyor...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="category-filter">
                <label htmlFor="category">Kategori Seç:</label>
                <select 
                    id="category" 
                    value={selectedCategory} 
                    onChange={handleCategoryChange}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="movies-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div 
                            key={movie.Title}
                            className={`movie-card ${selectedTitles.includes(movie.Title) ? 'selected' : ''}`}
                            onClick={() => handleSelection(movie.Title)}
                        >
                            <h3>{movie.Title}</h3>
                            <p>Tür: {movie.Genre}</p>
                            <p>Yıl: {movie["Release Year"]}</p>
                        </div>
                    ))
                ) : !loading && (
                    <div>Gösterilecek film bulunamadı.</div>
                )}
            </div>

            <button 
                onClick={getRecommendations} 
                disabled={selectedTitles.length !== 3}
                className="recommendation-button"
            >
                Öneri Al ({selectedTitles.length}/3)
            </button>

            {recommendations.length > 0 && (
                <div className="recommendations-section">
                    <h2>Önerilen Filmler</h2>
                    <div className="movies-grid">
                        {recommendations.map((movie, index) => (
                            <div key={index} className="movie-card recommendation">
                                <h3>{movie.Title}</h3>
                                <p>Tür: {movie.Genre}</p>
                                <p>Yıl: {movie["Release Year"]}</p>
                                <p>Dil: {movie.Language}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendationPage;
