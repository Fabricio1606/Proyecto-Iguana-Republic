const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Client = require('../models/client'); // Importa el modelo Client
const bcrypt = require('bcryptjs');

const TempPassModel = sequelize.define('TempPass', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    temp_password: {
        type: DataTypes.STRING(100), // Aumenta la longitud para almacenar el hash
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
    tableName: 'TempPasswords',
    timestamps: true,
    sequelize
});

// Hook para actualizar la columna updatedAt a la fecha actual antes de actualizar el registro
TempPassModel.beforeUpdate(async (instance, options) => {
    instance.setDataValue('updatedAt', new Date());
});

// Método para guardar un registro de contraseña temporal y actualizar el hash de contraseña del cliente
TempPassModel.saveTempPassword = async function (user_id, temp_password) {
    let tempPassRecord;

    try {
        // Hashear la contraseña temporal antes de guardarla
        const hashedTempPassword = bcrypt.hashSync(temp_password, 10);

        // Crear un registro de contraseña temporal con la contraseña hasheada
        tempPassRecord = await TempPassModel.create({
            user_id: user_id,
            temp_password: hashedTempPassword
        });

        // Actualizar el hash de contraseña del cliente en la tabla Client
        const client = await Client.findByPk(user_id);
        if (client) {
            // Actualizar el hash de contraseña del cliente
            await client.update({ passClient_hash: hashedTempPassword });
            console.log('Client password hash updated successfully:', hashedTempPassword);
        } else {
            console.error('Client not found while trying to update password hash.');
        }

        // Devolver el registro de contraseña temporal
        return tempPassRecord;
    } catch (error) {
        throw new Error('Error saving temporary password and updating client password hash in the database: ' + error.message);
    }
};

module.exports = TempPassModel;
