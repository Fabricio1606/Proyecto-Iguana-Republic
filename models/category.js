const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define("Category", {
  idCate: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nomCate: {
    type: DataTypes.STRING(50),
    allowNull: false,

    get() {
      const name = this.getDataValue("nomCate");
      return name ? name : null;
    },

    set(value) {
        this.setDataValue("nomCate", value);
    },

    validate: {
        notEmpty: true,
        len: [1, 50]
    }
  }
}, {
  sequelize,
  modelName: "category"
});

module.exports = Category;
