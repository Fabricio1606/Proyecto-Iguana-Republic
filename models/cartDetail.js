const { DataTypes, Sequelize } = require("sequelize")
const sequelize = require("../config/sequelize");
const Cart = require("./cart")
const Product = require("./product")

const CartDetail = sequelize.define("cartDetail", {
    idDetCart: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,

        get() {
            const quantity = this.getDataValue("quantity")
            return quantity ? quantity : null;
        },

        set(value) {
            this.setDataValue("quantity", value)
        },

        validate: {
            isNumeric: true,
            isInt: true
        }
    },

    unitPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 1,

        get() {
            const price = this.getDataValue("unitPrice")
            return price ? price : null;
        },

        set(value) {
            this.setDataValue("unitPrice", value)
        },

        validate: {
            isNumeric: true,
            isDecimal: true
        }
    }
}, {
    sequelize,
    modelName: "cartDetail"
});

Cart.hasMany(CartDetail, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
CartDetail.belongsTo(Cart);

Product.hasMany(CartDetail, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
CartDetail.belongsTo(Product);

module.exports = CartDetail;