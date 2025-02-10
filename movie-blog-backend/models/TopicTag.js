const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TopicTag = sequelize.define('TopicTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tag_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = TopicTag; 