// models/client.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Ajusta la ruta según tu estructura de archivos

const Client = sequelize.define('Client', {
    idClient: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nameClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mailClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneClient: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addressClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userClient: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passClient_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adminUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Client;
