const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize");
const Orders = require("./orders");

const Delivery = sequelize.define("delivery", {
    idDelivery: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },

    dateDeli: {
        type: DataTypes.DATEONLY,
        allowNull: true,

        get() {
            const date = this.getDataValue("dateDeli");
            return date ? date : null;
        },

        set(value) {
            this.setDataValue("dateDeli", value);
        },

        validate: {
            isDate: true
        }
    },

    statusDeli: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "On it's way",

        get() {
            const status = this.getDataValue("statusDeli");
            return status ? status : null;
        },

        set(value) {
            this.setDataValue("statusDeli", value);
        },

        validate: {
            notEmpty: true,
            len: [1, 20]
        }
    },

    commentDeli: {
        type: DataTypes.TEXT,
        allowNull: true,

        get() {
            const comment = this.getDataValue("commentDeli");
            return comment ? comment : null;
        },

        set(value) {
            this.setDataValue("commentDeli", value);
        }
    }
}, {
    sequelize,
    modelName: "delivery"
});

Orders.hasOne(Delivery, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Delivery.belongsTo(Orders);

module.exports = Delivery;