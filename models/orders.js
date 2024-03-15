const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")
const Client = require("./client")

const Orders = sequelize.define("Orders", {
    idOrder: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    dateOrder: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,

        get() {
            const date = this.getDataValue("dateOrder");
            return date ? date : null;
        },

        set(value) {
            this.setDataValue("dateOrder", value);
        },

        validate: {
            isDate: true,
            notEmpty: true
        }
    },

    statusOrder: {
        type: DataTypes.STRING(20),
        allowNull: false, 
        defaultValue: "Pending",

        get() {
            const status = this.getDataValue("statusOrder");
            return status ? status : null;
        },

        set(value) {
            this.setDataValue("statusOrder", value);
        },

        validate: {
            len: [1, 20],
            notEmpty: true
        }
    },

    totalOrder: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.00,

        get() {
            const total = this.getDataValue("totalOrder");
            return total ? total : null
        },

        set(value) {
            this.setDataValue("totalOrder", value);
        },

        validate: {
            notEmpty: true,
            isDecimal: true
        }
    }
}, {
    sequelize,
    modelName: "orders"
});

Client.hasMany(Orders, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Orders.belongsTo(Client);

module.exports = Orders;