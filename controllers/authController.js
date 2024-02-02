// authController.js
const AuthModel = require('../models/AuthModel');
const connection = require('../models/db');
const bcrypt = require('bcrypt');

class AuthController {
    constructor() {
        this.model = new AuthModel();
    }

    async getLogin(req, res) {
        try {
            // Obtener datos del modelo
            const data = await this.model.getData();
            // Renderizar la vista con los datos
            res.render('login', { data });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor.');
        }
    }

    async getRegister(req, res) {
        try {
            // Obtener datos del modelo
            const data = await this.model.getData();
            // Renderizar la vista con los datos
            res.render('register', { data });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor.');
        }
    }

    async postLogin(req, res) {
        try {
            const { username, password } = req.body;

            // Obtener el cliente de la base de datos
            const client = await this.model.getClientByUsername(username);

            if (client) {
                // Comparar la contraseña ingresada con la almacenada en la base de datos
                const result = await bcrypt.compare(password, client.passClient_hash);

                if (result) {
                    // Iniciar sesión y redirigir al cliente
                    req.session.client = client;
                    return res.redirect('index');
                } else {
                    // Contraseña incorrecta
                    return res.render('login', { message: 'Contraseña incorrecta.' });
                }
            } else {
                // Cliente no encontrado
                return res.render('login', { message: 'Cliente no encontrado.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor.');
        }
    }

    // authController.js
    async postRegister(req, res) {
        try {
            const { nombre, correo, nacionalidad, usuario, password } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await this.model.getClientByUsername(usuario);

            if (existingUser) {
                // El nombre de usuario ya está en uso
                return res.render('register', { message: 'El nombre de usuario ya está en uso.' });
            }

            // Hash de la contraseña antes de almacenarla
            const hash = await bcrypt.hash(password, 10);

            // Insertar el cliente en la base de datos
            await this.model.insertClient(nombre, correo, nacionalidad, usuario, hash);

            // Registro exitoso, redirigir al cliente a la página de inicio de sesión
            return res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor.');
        }
    }

}

module.exports = AuthController;
