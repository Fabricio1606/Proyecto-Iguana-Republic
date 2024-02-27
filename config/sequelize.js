// sequelize.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('iguanarepublicdb', 'root', '$Fabricio160603', {
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
