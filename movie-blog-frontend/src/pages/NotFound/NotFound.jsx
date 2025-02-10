import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Sayfa Bulunamadı</h2>
      <p>Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
      <Link to="/" className="home-button">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default NotFound; 