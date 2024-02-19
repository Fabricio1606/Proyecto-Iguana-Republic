const { v4: uuidv4 } = require('uuid');
const connection = require('./db');

class TokenModel {
    constructor() {
        // Inicializa datos si es necesario
        this.data = "";
    }

    // Método para generar un token único
    generateToken() {
        return uuidv4();
    }

    // Método para almacenar el token en la base de datos
    async storeToken(user_id, token) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Tokens (user_id, token) VALUES (?, ?)',
                [user_id, token],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    // Método para verificar si un token existe en la base de datos
    async tokenExists(token) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM Tokens WHERE token = ?',
                [token],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.length > 0);
                    }
                }
            );
        });
    }

    // Método para eliminar un token de la base de datos
    async deleteToken(token) {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM Tokens WHERE token = ?',
                [token],
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}

module.exports = TokenModel;
