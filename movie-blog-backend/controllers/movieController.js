const Movie = require('../models/movie');

// Yeni film oluştur
const createMovie = async (req, res) => {
    try {
        const { title, genre, releaseYear, rating, description } = req.body;
        const newMovie = await Movie.create({ title, genre, releaseYear, rating, description });
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: 'Error creating movie', error: error.message });
    }
};

// Tüm filmleri listele
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

// Belirli bir filmi getir
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie', error: error.message });
    }
};

// Filmi güncelle
const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, genre, releaseYear, rating, description } = req.body;
        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.update({ title, genre, releaseYear, rating, description });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error: error.message });
    }
};

// Filmi sil
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.destroy();
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error: error.message });
    }
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};
