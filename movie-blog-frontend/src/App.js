import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Main/MainPage";
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import TvShowDetail from "./pages/TvShowDetail/TvShowDetail";
import MoviesPage from "./pages/Movies/MoviesPage";
import TvShowsPage from "./pages/TvShows/TvShowsPage";
import BlogPage from "./pages/Blog/BlogPage";
import CreateBlog from "./pages/Blog/CreateBlog/CreateBlog";
import Profile from "./pages/Profile/ProfilePage";
import SearchResults from "./pages/SearchResults/SearchResults";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import NotFound from "./pages/NotFound/NotFound";
import RecommendationPage from './pages/RecommendationPage/RecommendationPage';
import "./App.css";

function App() {
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/movies" element={<MoviesPage />} />
                            <Route path="/tv-shows" element={<TvShowsPage />} />
                            <Route path="/movie/:id" element={<MovieDetail />} />
                            <Route path="/tv/:id" element={<TvShowDetail />} />
                            <Route path="/recommendations" element={<RecommendationPage />} />
                            <Route path="/blog-page" element={<BlogPage />} />
                            <Route path="/search" element={<SearchResults />} />

                            <Route element={<PrivateRoute />}>
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/create-blog" element={<CreateBlog />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
