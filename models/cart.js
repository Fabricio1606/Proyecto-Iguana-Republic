const { DataTypes, Sequelize, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const Client = require("./client");

const Cart = sequelize.define("Cart", {
    idCart: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    dateCart: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,

        get() {
            const date = this.getDataValue("dateCart");
            return date ? date : null;
        },

        set(value) {
            this.setDataValue("dateCart", value)
        },

        validate: {
            notEmpty: true
        }
    },

    stateCart: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "In progress...",

        get() {
            const state = this.getDataValue("stateCart");
            return state ? state : null;
        },

        set(value) {
            this.setDataValue("stateCart", value)
        },

        validate: {
            len: [1, 20],
            notEmpty: true
        }
    },

    totalPriceCart: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00,

        get() {
            const total = this.getDataValue("totalPriceCart");
            return total ? total : null
        },

        set(value) {
            this.setDataValue("totalPriceCart", value);
        },

        validate: {
            isNumeric: true,
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: "cart"
});

Client.hasOne(Cart, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Cart.belongsTo(Client);

module.exports = Cart;