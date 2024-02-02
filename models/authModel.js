const connection = require('./db');

class AuthModel {
    constructor() {
      // Inicializa datos si es necesario
      this.data = "";
    }
  
    getData() {
      // Retorna los datos del modelo
      return this.data;
    }
  
    async insertClient(nombre, correo, nacionalidad, phone, address, usuario, hash) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Client (nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, correo, nacionalidad, phone, address, usuario, hash],
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
