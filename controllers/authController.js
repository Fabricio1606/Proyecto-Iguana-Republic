// authController.js
const bcrypt = require('bcryptjs');
const Client = require('../models/client');
const TokenModel = require('../models/tokenModel');
const EmailService = require('../logic/emailService');

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
        res.locals.user = req.session.client;
        res.redirect('/'); // Redirige a la página de dashboard u otra ruta
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
        res.locals.user = req.session.client;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


authController.resetPassword = async (req, res) => {
    const { emailResetPass } = req.body; // Corregir aquí

    try {
        // Generar un token único
        const tokenModel = new TokenModel();
        const resetToken = tokenModel.generateToken();

        // Buscar al usuario en la base de datos
        const client = await Client.findOne({ where: { mailClient: emailResetPass } }); // Corregir aquí

        if (!client) {
            // Si el usuario no existe, enviar un mensaje de error
            return res.status(404).send('Usuario no encontrado');
        }

        // Almacenar el token en el modelo del cliente
        client.resetToken = resetToken;
        await client.save();

        // Crear una instancia de EmailService y pasar el correo electrónico del remitente
        const emailService = new EmailService('reset.pass.iguanarepublic@gmail.com'); // Ajusta el correo electrónico del remitente

        // Enviar el token por correo electrónico al usuario utilizando el servicio de correo electrónico
        await emailService.sendPasswordResetEmail(emailResetPass, resetToken); // Corregir aquí

        // Enviar una respuesta de éxito
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
            res.locals.user = null;
            res.redirect('/');
        }
    });
};

module.exports = authController;
