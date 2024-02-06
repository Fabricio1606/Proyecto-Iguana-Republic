const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
  idCate: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nomCate: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descCate: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'category',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "idCate" },
      ]
    },
  ]
});

module.exports = Category;
