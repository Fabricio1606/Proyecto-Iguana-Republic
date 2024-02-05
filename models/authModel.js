// AuthModel.js
const connection = require('./db');

class AuthModel {
    constructor() {
      // No es necesario inicializar datos
    }
  
    async getClientByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Client WHERE userClient = ?', [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    // Devuelve el cliente encontrado (o null si no se encuentra)
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }

    async insertClient(nombre, correo, nacionalidad, usuario, hash) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Client (nameClient, mailClient, nationClient, userClient, passClient_hash) VALUES (?, ?, ?, ?, ?)',
                [nombre, correo, nacionalidad, usuario, hash],
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

module.exports = AuthModel;
