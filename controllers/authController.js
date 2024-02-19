// authController.js
const bcrypt = require('bcrypt');
const Client = require('../models/client');
const TokenModel = require('../models/tokenModel');
const sendResetEmail = require('../logic/emailService');

const authController = {};

authController.showLogin = (req, res) => {
    res.render('login'); // Renderiza la vista de inicio de sesión
};

authController.showRegister = (req, res) => {
    res.render('register'); // Renderiza la vista de registro
};

// Método para mostrar el formulario de restablecimiento de contraseña
authController.showResetPasswordForm = (req, res) => {
    res.render('reset-password'); // Renderiza la vista reset-password.ejs
};

authController.login = async (req, res) => {
    const { userClient, passClient } = req.body;

    try {
        const client = await Client.findOne({ where: { userClient } });

        if (!client || !bcrypt.compareSync(passClient, client.passClient_hash)) {
            return res.status(401).send('Credenciales incorrectas');
        }

        req.session.client = client; // Almacena al cliente en la sesión
        res.redirect('/dashboard'); // Redirige a la página de dashboard u otra ruta
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

authController.register = async (req, res) => {
    const { nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(passClient, 10);
        const newClient = await Client.create({
            nameClient,
            mailClient,
            nationClient,
            phoneClient,
            addressClient,
            userClient,
            passClient_hash: hashedPassword,
            adminUser: false // Asegúrate de proporcionar un valor para adminUser
        });

        req.session.client = newClient;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

authController.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const client = await Client.findOne({ where: { mailClient: email } });

        if (!client) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Generar un token único
        const tokenModel = new TokenModel();
        const resetToken = tokenModel.generateToken();

        // Almacenar el token en el modelo del cliente
        client.resetToken = resetToken;
        await client.save();

        // Enviar el token por correo electrónico al usuario utilizando la clase EmailService
        await emailService.sendPasswordResetEmail(client.mailClient, resetToken);

        res.send('Correo electrónico de restablecimiento de contraseña enviado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

authController.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al cerrar sesión');
        } else {
            res.redirect('/');
        }
    });
};

module.exports = authController;
