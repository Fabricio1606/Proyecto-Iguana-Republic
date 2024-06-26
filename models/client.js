const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

const Client = sequelize.define(
  "Client",
  {
    idClient: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    nameClient: {
      type: DataTypes.STRING,
      allowNull: false,

      get() {
        const name = this.getDataValue("nameClient");
        return name ? name : null;
      },

      set(value) {
        this.setDataValue("nameClient", value);
      },

      validate: {
        notEmpty: true,
      },
        validate: {
            notEmpty: true
        }
    },

    mailClient: {
      type: DataTypes.STRING,
      allowNull: false,

      get() {
        const mail = this.getDataValue("mailClient");
        return mail ? mail : null;
      },

      set(value) {
        this.setDataValue("mailClient", value);
      },

      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    nationClient: {
      type: DataTypes.STRING,
      allowNull: false,

      get() {
        const nation = this.getDataValue("nationClient");
        return nation ? nation : null;
      },

      set(value) {
        this.setDataValue("nationClient", value);
      },

      validate: {
        notEmpty: true,
        // Permitir letras y espacios
        is: /^[A-Za-z\s]+$/,
      },
    },

    phoneClient: {
      type: DataTypes.STRING,
      defaultValue: "N/A",

      get() {
        const phone = this.getDataValue("phoneClient");
        return phone ? phone : null;
      },

      set(value) {
        this.setDataValue("phoneClient", value);
      },
    },

    addressClient: {
      type: DataTypes.STRING,
      defaultValue: "N/A",

      get() {
        const address = this.getDataValue("addressClient");
        return address ? address : null;
      },

      set(value) {
        this.setDataValue("addressClient", value);
      },

      validate: {
        notEmpty: true,
      },
    },

    userClient: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      get() {
        const user = this.getDataValue("userClient");
        return user ? user : null;
      },

      set(value) {
        this.setDataValue("userClient", value);
      },

      validate: {
        notEmpty: true,
      },
    },
    passClient_hash: {
      type: DataTypes.STRING,
      allowNull: false,

      get() {
        const pass = this.getDataValue("passClient_hash");
        return pass ? pass : null;
      },

      set(value) {
        this.setDataValue("passClient_hash", value);
      },

      validate: {
        notEmpty: true,
      },
    },
    adminUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,

      get() {
        const admin = this.getDataValue("adminUser");
        return admin;
      },

      set(value) {
            if(value == "Administrador") {
                this.setDataValue("adminUser", true);
            } else if(value == "Usuario") {
                this.setDataValue("adminUser", false);
            } else {
            this.setDataValue("adminUser", value);
            }
      },

        validate: {
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: "clients",
  }
);

module.exports = Client;