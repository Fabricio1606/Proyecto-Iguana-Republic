const { DataTypes, Sequelize } = require("sequelize")
const sequelize = require("../config/sequelize");
const Orders = require("./orders");
const Product = require("./product");

const OrderDetails = sequelize.define("orderDetails", {
    idOrderDetail: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,

        get() {
            const quantity = this.getDataValue("quantity");
            return quantity ? quantity : null
        },

        set(value) {
            this.setDataValue("quantity", value);
        },

        validate: {
            isInt: true,
            notEmpty: true
        }
    },

    unitPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,

        get() {
            const price = this.getDataValue("unitPrice");
            return price ? price : null
        },

        set(value) {
            this.setDataValue("unitPrice", value)
        },

        validate: {
            notEmpty: true,
            isDecimal: true
        }
    },

    totalLine: {
        type: DataTypes.DECIMAL,
        allowNull: false,

        get() {
            const total = this.getDataValue("totalLine")
            return total ? total : null
        },

        set(value) {
            this.setDataValue("totalLine", value)
        },

        validate: {
            notEmpty: true,
            isDecimal: true
        }
    }
}, {
    sequelize,
    modelName: "orderDetails"
});

Orders.hasMany(OrderDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
OrderDetails.belongsTo(Orders);

Product.hasMany(OrderDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
OrderDetails.belongsTo(OrderDetails);

module.exports = OrderDetails;