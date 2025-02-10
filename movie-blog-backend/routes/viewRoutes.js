const express = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');
const Movie = require('../models/movie');
const router = express.Router();

// Kullanıcıları listeleyen view
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        let html = '<h1>Users</h1><ul>';
        users.forEach(user => {
            html += `<li>${user.username} (${user.role}) - ${user.email}</li>`;
        });
        html += '</ul>';
        res.send(html);
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

// Blogları listeleyen view
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        let html = '<h1>Blogs</h1><ul>';
        blogs.forEach(blog => {
            html += `<li><strong>${blog.title}</strong> by ${blog.author}<br>${blog.content}</li>`;
        });
        html += '</ul>';
        res.send(html);
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

// Filmleri listeleyen view
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        let html = '<h1>Movies</h1><ul>';
        movies.forEach(movie => {
            html += `<li><strong>${movie.title}</strong> (${movie.releaseYear}) - Rating: ${movie.rating}<br>${movie.description}</li>`;
        });
        html += '</ul>';
        res.send(html);
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

module.exports = router;
