const { DataTypes, Sequelize } = require("sequelize")
const sequelize = require("../config/sequelize");
const Orders = require("./orders");

const Invoice = sequelize.define("Invoice", {
    idDelivery: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },

    dateInvoice: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,

        get() {
            const date = this.getDataValue("dateInvoice");
            return date ? date : null;
        },

        set(value) {
            this.setDataValue("dateInvoice", value);
        },

        validate: {
            isDate: true,
            notEmpty: true
        }
    },

    totalAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.00,
        allowNull: false,

        get() {
            const total = this.getDataValue("totalAmount");
            return total ? total : null;
        },

        set(value) {
            this.setDataValue("totalAmount", value);
        },

        validate: {
            isDecimal: true,
            notEmpty: true
        }
    },

    statusInvoice: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Pending",

        get() {
            const status = this.getDataValue("statusInvoice");
            return status ? status : null;
        },

        set(value) {
            this.setDataValue("statusInvoice", value);
        },

        validate: {
            len: [1, 20],
            notEmpty: true
        }
    },

    paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,

        get() {
            const payment = this.getDataValue("paymentMethod");
            return payment ? payment : null;
        },

        set(value) {
            this.setDataValue("paymentMethod", value);
        },

        validate: {
            len: [1, 50],
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: "invoice"
});

Orders.hasOne(Invoice, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Invoice.belongsTo(Orders);

module.exports = Invoice;