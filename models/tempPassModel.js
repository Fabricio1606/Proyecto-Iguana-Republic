const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Client = require('../models/client'); // Importa el modelo Client

const TempPassModel = sequelize.define('TempPass', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER, // Usa el mismo tipo de dato que el campo de identificación en el modelo Client
        allowNull: false
    },
    temp_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
    }
}, {
    tableName: 'TempPasswords', // Nombre de la tabla en la base de datos
    timestamps: true, // Agrega campos createdAt y updatedAt automáticamente
    sequelize
});

// Método para guardar un registro de contraseña temporal en la base de datos
TempPassModel.saveTempPassword = async function (user_id, temp_password) {
    try {
        const tempPassRecord = await TempPassModel.create({
            user_id: user_id,
            temp_password: temp_password
        });
        return tempPassRecord;
    } catch (error) {
        throw new Error('Error al guardar la contraseña temporal en la base de datos');
    }
};

// Método para actualizar el campo passClientHash de un cliente en la base de datos
TempPassModel.updateClientPasswordHash = async function (user_id, new_password_hash) {
    try {
        await Client.update({ passClient_hash: new_password_hash }, {
            where: { id: user_id } // Utiliza el campo de identificación correcto del modelo Client
        });
    } catch (error) {
        throw new Error('Error al actualizar el hash de contraseña del cliente en la base de datos');
    }
};

module.exports = TempPassModel;
