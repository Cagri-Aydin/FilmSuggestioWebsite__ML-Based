const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('topics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    message_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_activity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'topics',
    timestamps: false
});

module.exports = Topic; 