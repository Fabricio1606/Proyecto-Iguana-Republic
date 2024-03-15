const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

const Supplier = sequelize.define("Supplier", {
    idSupplier: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },

    nameSupplier: {
        type: DataTypes.STRING(255),
        allowNull: false,

        get() {
            const name = this.getDataValue("nameSupplier");
            return name ? name : null;
        },

        set(value) {
            this.setDataValue("nameSupplier", value);
        },

        validate: {
            len: [1, 255],
            notEmpty: true
        }
    },

    mailSupplier: {
        type: DataTypes.STRING(255),
        allowNull: false,

        get() {
            const mail = this.getDataValue("mailSupplier");
            return mail ? mail : null
        },

        set(value) {
            this.setDataValue("mailSupplier", value);
        },

        validate: {
            isEmail: true, 
            notEmpty: true
        }
    },

    phoneSupplier: {
        type: DataTypes.INTEGER,
        allowNull: false,

        get() {
            const phone = this.getDataValue("phoneSupplier");
            return phone ? phone : null;
        },

        set(value) {
            this.setDataValue("phoneSupplier", value);
        },

        validate: {
            isNumeric: true,
            isFloat: false
        }
    },

    addressSupplier: {
        type: DataTypes.STRING(255),
        allowNull: false,

        get() {
            const address = this.getDataValue("addressSupplier");
            return address ? address : null;
        },

        set(value) {
            this.setDataValue("addressSupplier", value);
        },

        validate: {
            len: [1, 255],
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: "supplier"
});

module.exports = Supplier;