const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Movie extends Model {}

Movie.init({
    tmdb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    overview: {
        type: DataTypes.TEXT
    },
    poster_path: {
        type: DataTypes.STRING
    },
    backdrop_path: {
        type: DataTypes.STRING
    },
    release_date: {
        type: DataTypes.DATE
    },
    vote_average: {
        type: DataTypes.FLOAT
    },
    popularity: {
        type: DataTypes.FLOAT
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Movie'
});

module.exports = Movie;
