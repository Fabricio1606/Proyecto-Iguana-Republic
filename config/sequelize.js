// sequelize.js

const { Sequelize } = require("sequelize");

<<<<<<< HEAD
const sequelize = new Sequelize("iguanarepublicdb", "root", "1234", {
=======
const sequelize = new Sequelize("iguanarepublicdb", "root", "soraraper1", {
>>>>>>> 3ff41638d4ca5dd66aa2da5ac042be72ed70e6ff
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
