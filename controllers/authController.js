const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Client = require('../models/client');
const TokenModel = require('../models/tokenModel');
const EmailService = require('../services/emailService');
const TempPassModel = require('../models/tempPassModel');
const { Country } = require("country-state-city");
const emailService = new EmailService('reset.pass.iguanarepublic@gmail.com', TempPassModel);
const UserService = require("../services/userService");

const userService = new UserService();
const authController = {};

function createSession(client, req, res) {
    req.session.client = client;
    req.session.id = client.idClient; 
    res.locals.user = req.session.client;
    res.locals.id = req.session.id;
}

authController.showLogin = (req, res, next) => {
    try {
        const countries = Country.getAllCountries();
        res.render('login', { countries: countries });
    } catch(ex) {
        next(ex);
    }
};

// Mostrar la página de registro
authController.showRegister = (req, res) => {
    res.render('register');
};

authController.showResetPasswordForm = (req, res) => {
    res.render('reset-password'); 
};

// Mostrar la página de error de inicio de sesión
authController.showerrorLogin = (req, res) => {
    res.render('errorLogin');
};

// Manejar el inicio de sesión
authController.login = async (req, res, next) => {
    const { userClient, passClient } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const client = await Client.findOne({ where: { userClient } });

        if (!client) {
            console.log("Usuario no encontrado");
            return res.redirect('errorLogin'); 
        }

        console.log("Usuario encontrado:", client.userClient);
        console.log("Contraseña ingresada:", passClient);
        console.log("Hash en la base de datos:", client.passClient_hash);

        // Verificar la contraseña encriptada usando bcrypt
        const isPasswordMatch = await bcrypt.compare(passClient, client.passClient_hash);

        console.log("¿Coincide la contraseña?:", isPasswordMatch);

        if (!isPasswordMatch) {
            console.log("Contraseña incorrecta");
            return res.redirect('errorLogin'); 
        }

        createSession(client, req, res);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

authController.register = async (req, res, next) => {
    try {
        const { nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient } = req.body;
        const newClient = await userService.createUser(nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient);

        createSession(newClient, req, res);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

// Manejar el restablecimiento de la contraseña
authController.resetPassword = async (req, res) => {
    const { emailResetPass } = req.body;

    try {
        // Generar una única contraseña temporal de 8 caracteres
        const tempPassword = crypto.randomBytes(4).toString('hex').slice(0, 8);
        console.log('Contraseña temporal generada y enviada:', tempPassword);

        // Buscar al usuario en la base de datos
        const client = await Client.findOne({ where: { mailClient: emailResetPass } });

        if (!client) {
            req.flash('error_msg', 'Usuario no encontrado');
            return res.redirect('/resetpass');
        }

        // Enviar el correo electrónico con la contraseña temporal y guardarla en la base de datos
        try {
            await emailService.sendPasswordResetEmail(emailResetPass, client.idClient, tempPassword);
            console.log('Email enviado con la contraseña temporal.');
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            req.flash('error_msg', 'No se pudo enviar el correo electrónico.');
            return res.redirect('/resetpass');
        }

        req.flash('success_msg', 'Your temporary password has been sent.');
        setTimeout(() => {
            res.redirect('/login');
        }, 10000); // Redirigir después de 10 segundos
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error interno del servidor');
        res.redirect('/resetpass');
    }
};


// Manejar el cierre de sesión
authController.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err)
        } else {
            res.locals.user = null;
            res.redirect('/');
        }
    });
};

module.exports = authController;