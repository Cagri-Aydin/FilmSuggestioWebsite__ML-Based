const express = require('express');
const User = require('../models/user');
const Movie = require('../models/movie');
const Blog = require('../models/blog');
const router = express.Router();

// Yönetim Görünümü
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        const movies = await Movie.findAll();
        const blogs = await Blog.findAll();

        let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .section { margin-bottom: 40px; }
          .form-group { margin-bottom: 10px; }
          label { display: block; margin-bottom: 5px; }
          input, textarea { width: 100%; padding: 8px; }
          button { margin-top: 10px; padding: 10px; }
          ul { list-style: none; padding: 0; }
          li { margin: 10px 0; background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Admin Panel</h1>
        
        <div class="section">
          <h2>Users</h2>
          <ul>
            ${users.map(user => `<li><strong>${user.username}</strong> (${user.role}) - ${user.email}</li>`).join('')}
          </ul>
          <h3>Add User</h3>
          <form action="/admin/add-user" method="POST">
            <div class="form-group">
              <label>Username</label>
              <input type="text" name="username" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" name="password" required>
            </div>
            <div class="form-group">
              <label>Role</label>
              <input type="text" name="role" value="user" required>
            </div>
            <button type="submit">Add User</button>
          </form>
        </div>

        <div class="section">
          <h2>Movies</h2>
          <ul>
            ${movies.map(movie => `<li><strong>${movie.title}</strong> (${movie.genre}) - ${movie.releaseYear}</li>`).join('')}
          </ul>
          <h3>Add Movie</h3>
          <form action="/admin/add-movie" method="POST">
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" required>
            </div>
            <div class="form-group">
              <label>Genre</label>
              <input type="text" name="genre" required>
            </div>
            <div class="form-group">
              <label>Release Year</label>
              <input type="number" name="releaseYear" required>
            </div>
            <div class="form-group">
              <label>Rating</label>
              <input type="number" step="0.1" name="rating">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description"></textarea>
            </div>
            <button type="submit">Add Movie</button>
          </form>
        </div>

        <div class="section">
          <h2>Blogs</h2>
          <ul>
            ${blogs.map(blog => `<li><strong>${blog.title}</strong> by ${blog.author}</li>`).join('')}
          </ul>
          <h3>Add Blog</h3>
          <form action="/admin/add-blog" method="POST">
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" required>
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea name="content" required></textarea>
            </div>
            <div class="form-group">
              <label>Author</label>
              <input type="text" name="author" required>
            </div>
            <button type="submit">Add Blog</button>
          </form>
        </div>
      </body>
      </html>
    `;

        res.send(html);
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

// Kullanıcı Ekleme
router.post('/add-user', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        await User.create({ username, email, password, role });
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send(`<h1>Error Adding User</h1><p>${error.message}</p>`);
    }
});

// Film Ekleme
router.post('/add-movie', async (req, res) => {
    try {
        const { title, genre, releaseYear, rating, description } = req.body;
        await Movie.create({ title, genre, releaseYear, rating, description });
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send(`<h1>Error Adding Movie</h1><p>${error.message}</p>`);
    }
});

// Blog Ekleme
router.post('/add-blog', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await Blog.create({ title, content, author });
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send(`<h1>Error Adding Blog</h1><p>${error.message}</p>`);
    }
});

module.exports = router;
