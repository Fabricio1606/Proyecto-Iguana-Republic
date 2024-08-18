const bcrypt = require('bcryptjs');
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

authController.showRegister = (req, res) => {
    res.render('register');
};

authController.showResetPasswordForm = (req, res) => {
    res.render('reset-password'); 
};

authController.showerrorLogin = (req, res) => {
    res.render('errorLogin');
};

authController.login = async (req, res, next) => {
    try {
        const { userClient, passClient } = req.body;
        const client = await userService.getUserByUsername(userClient);

        if (!client || !bcrypt.compareSync(passClient, client.passClient_hash)) {
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

authController.resetPassword = async (req, res) => {
    const { emailResetPass } = req.body;

    try {
        // Generar un token único
        const tokenModel = new TokenModel();
        const resetToken = tokenModel.generateToken();

        // Buscar al usuario en la base de datos
        const client = await Client.findOne({ where: { mailClient: emailResetPass } });

        if (!client) {
            // Si el usuario no existe, enviar un mensaje de error
            req.flash('error_msg', 'Usuario no encontrado');
            return res.redirect('/resetpass');
        }

        // Almacenar el token en el modelo del cliente
        client.resetToken = resetToken;
        await client.save();

        // Enviar el token por correo electrónico al usuario utilizando el servicio de correo electrónico
        await emailService.sendPasswordResetEmail(emailResetPass, client.idClient, resetToken);

        // Mostrar un mensaje flash de éxito
        req.flash('success_msg', 'Your temporary password has been sent.');

        // Redirigir al usuario después de un breve tiempo
        setTimeout(() => {
            res.redirect('/login');
        }, 10000); // Redirigir después de 10 segundos
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error interno del servidor');
        res.redirect('/resetpass');
    }
};

authController.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.render("500", { error: error });
        } else {
            res.locals.user = null;
            res.redirect('/');
        }
    });
};

module.exports = authController;