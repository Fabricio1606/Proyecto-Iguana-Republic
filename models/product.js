const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product = sequelize.define('Product', {
  idProd: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nameProd: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  imgProd: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  priceProd: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  stockProd: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descProd: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idCate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'category',
      key: 'id_cate'
    }
  },
}, {
  sequelize,
  tableName: 'product',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "idProd" },
      ]
    },
    {
      name: "id_cate",
      using: "BTREE",
      fields: [
        { name: "idCate" },
      ]
    },
  ]
});
module.exports = Product;
