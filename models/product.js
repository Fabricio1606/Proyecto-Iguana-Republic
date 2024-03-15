const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require('../config/sequelize');
const category = require("./category");

const Product = sequelize.define("Products", {
  idProd: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },

  nameProd: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "Product",

    get() {
      const name = this.getDataValue("nameProd");
      return name ? name : null;
    },

    set(value) {
      this.setDataValue("nameProd", value);
    },

    validate: {
      len: [1, 100],
      notEmpty: true
    }
  },

  imgProd: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "g1.jpg", 

    get() {
      const image = this.getDataValue("imgProd");
      return image ? image : null;
    },

    set(value) {
      this.setDataValue("imageProd", value);
    },

    validate: {
      len: [1, 100],
      notEmpty: true
    }
  },

  priceProd: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.00,

    get() {
      const price = this.getDataValue("priceProd");
      return price ? price : null;
    },

    set(value) {
      this.setDataValue("priceProd", value);
    },

    validate: {
      isFloat: true,
      notEmpty: true
    }
  },
  
  stockProd: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,

    get() {
      const price = this.getDataValue("stockProd");
      return price ? price : null;
    },

    set(value) {
      this.setDataValue("priceProd", value);
    },

    validate: {
      isNumeric: true,
      isInt: true,
      notEmpty: true
    }
  },

  shortDescProd: {
    type: DataTypes.STRING(130),
    allowNull: false,
    defaultValue: "This is a short description",

    get() {
      const desc = this.getDataValue("shortDescProd");
      return desc ? desc : null;
    },

    set(value) {
      this.setDataValue("shortDescProd", value);
    },

    validate: {
      len: [1, 130],
      notEmpty: true
    }
  },

  descProd: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "This is the description of the product",

    get() {
      const desc = this.getDataValue("descProd");
      return desc ? desc : null;
    },

    set(value) {
      this.setDataValue("descProd", value);
    },

    validate: {
      notEmpty: true
    }
  }
}, {
  sequelize,
  modelName: "products"
});

category.hasMany(Product, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
Product.belongsTo(category);

module.exports = Product;
