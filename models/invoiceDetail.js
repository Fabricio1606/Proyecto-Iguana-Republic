const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize");
const Invoice = require("./invoice");
const OrderDetails = require("./orderDetails");

const InvoiceDetail = sequelize.define("invoiceDetail", {
    idDelivery: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
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
    modelName: "invoiceDetail"
});

Invoice.hasOne(InvoiceDetail, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
InvoiceDetail.belongsTo(Invoice);

OrderDetails.hasMany(Invoice, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
InvoiceDetail.belongsTo(OrderDetails);

module.exports = InvoiceDetail;