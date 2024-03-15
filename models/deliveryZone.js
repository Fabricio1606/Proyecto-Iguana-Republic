const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")

const DeliveryZone = sequelize.define("deliveryZone", {
    idDeliZone: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },

    nameZone: {
        type: DataTypes.STRING(20),
        allowNull: false,

        get() {
            const name = this.getDataValue("nameZone");
            return name ? name : null;
        },

        set(value) {
            this.setDataValue("nameZone", value);
        },

        validate: {
            notEmpty: true,
            len: [1, 20]
        }
    }
}, {
    sequelize,
    modelName: "deliveryZone"
});

module.exports = DeliveryZone;