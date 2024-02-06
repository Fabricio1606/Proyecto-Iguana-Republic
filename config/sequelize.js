// sequelize.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('iguanarepublicdb', 'root', 'soraraper1', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});




module.exports = sequelize;
