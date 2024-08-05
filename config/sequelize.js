// sequelize.js

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("iguatxvr_iguanarepublicdb", "iguatxvr_root", "*TvBEr&)oAb!", {

  host: "localhost",
  dialect: "mysql",
  port: 3306,
  define: {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  },
});

module.exports = sequelize;
