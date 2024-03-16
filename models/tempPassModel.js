const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importa la instancia de Sequelize

class TempPassModel {
    constructor() {
        // Define el modelo de la tabla TempPasswords
        this.TempPassword = sequelize.define('TempPassword', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.UUID,
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
            timestamps: true // Agrega campos createdAt y updatedAt automáticamente
        });
    }

    // Método para guardar un registro de contraseña temporal en la base de datos
    async saveTempPassword(user_id, temp_password) {
        try {
            const tempPassRecord = await this.TempPassword.create({
                user_id: user_id,
                temp_password: temp_password
            });
            return tempPassRecord;
        } catch (error) {
            throw new Error('Error al guardar la contraseña temporal en la base de datos');
        }
    }

    // Método para actualizar el campo passClientHash de un cliente en la base de datos
    async updateClientPasswordHash(user_id, new_password_hash) {
        try {
            await Client.update({ passClientHash: new_password_hash }, {
                where: { id: user_id }
            });
        } catch (error) {
            throw new Error('Error al actualizar el hash de contraseña del cliente en la base de datos');
        }
    }
}

module.exports = TempPassModel;
