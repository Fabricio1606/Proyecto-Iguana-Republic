// authController.js
const connection = require('../models/db');
const bcrypt = require('bcrypt');

class AuthController {
    constructor() {

    }

    postLogin(req, res) {
        const { username, password } = req.body;

        // Obtener el cliente de la base de datos
        connection.query('SELECT * FROM Client WHERE userClient = ?', [username], (error, results) => {
            if (error) {
                return res.status(500).send('Error en el servidor.');
            }

            if (results.length > 0) {
                const client = results[0];

                // Comparar la contraseña ingresada con la almacenada en la base de datos
                bcrypt.compare(password, client.passClient_hash, (err, result) => {
                    if (err) {
                        return res.status(500).send('Error en el servidor.');
                    }

                    if (result) {
                        // Iniciar sesión y redirigir al cliente
                        req.session.client = client;
                        return res.redirect('index');
                    } else {
                        // Contraseña incorrecta
                        return res.render('login', { message: 'Contraseña incorrecta.' });
                    }
                });
            } else {
                // Cliente no encontrado
                return res.render('login', { message: 'Cliente no encontrado.' });
            }
        });
    }

    postRegister(req, res) {
        const { nombre, correo, nacionalidad, usuario, password } = req.body;

        // Verificar si el usuario ya existe
        connection.query('SELECT * FROM Client WHERE userClient = ?', [usuario], (error, results) => {
            if (error) {
                return res.status(500).send('Error en el servidor.');
            }

            if (results.length > 0) {
                // El nombre de usuario ya está en uso
                return res.render('register', { message: 'El nombre de usuario ya está en uso.' });
            }

            // Hash de la contraseña antes de almacenarla
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send('Error en el servidor.');
                }

                // Insertar el cliente en la base de datos
                connection.query(
                    'INSERT INTO Client (nameClient, mailClient, nationClient, userClient, passClient_hash) VALUES (?, ?, ?, ?, ?)',
                    [nombre, correo, nacionalidad, usuario, hash],
                    (error) => {
                        if (error) {
                            return res.status(500).send('Error en el servidor.');
                        }

                        // Registro exitoso, redirigir al cliente a la página de inicio de sesión
                        return res.redirect('/login');
                    }
                );
            });
        });
    }
}

module.exports = new AuthController();
