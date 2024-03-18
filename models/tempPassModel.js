const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Client = require('../models/client'); // Importa el modelo Client
const crypto = require('crypto');

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
        type: DataTypes.STRING(10), // Limita la longitud de la contraseña temporal a 10 caracteres
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
TempPassModel.saveTempPassword = async function (user_id) {
    let tempPassRecord;

    try {
        // Generar una cadena aleatoria de longitud fija (por ejemplo, 6 caracteres)
        const temp_password = crypto.randomBytes(3).toString('hex'); // Genera 6 caracteres hexadecimales (3 bytes)

        // Crear un registro de contraseña temporal sin encriptar
        tempPassRecord = await TempPassModel.create({
            user_id: user_id,
            temp_password: temp_password
        });

        // Actualizar el hash de contraseña del cliente en la tabla Client
        const client = await Client.findByPk(user_id);
        if (client) {
            // Actualizar el hash de contraseña del cliente
            await client.update({ passClient_hash: temp_password });
            console.log('Client password hash updated successfully:', temp_password);

            // Sincronizar la base de datos después de la actualización
            await sequelize.sync();
            console.log('Database synchronized successfully after update');
        } else {
            console.error('Client not found while trying to update password hash.');
        }

        // Devolver el registro de contraseña temporal
        return tempPassRecord;
    } catch (error) {
        // Si hay un error en alguna de las operaciones, lanzar una excepción con el mensaje de error
        throw new Error('Error saving temporary password and updating client password hash in the database: ' + error.message);
    }
};

module.exports = TempPassModel;
