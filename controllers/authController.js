const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Client = require('../models/client');
const TokenModel = require('../models/tokenModel');
const EmailService = require('../logic/emailService');
const TempPassModel = require('../models/tempPassModel');
const { Country } = require("country-state-city");
const emailService = new EmailService('reset.pass.iguanarepublic@gmail.com', TempPassModel);

const authController = {};

// Mostrar la página de inicio de sesión
authController.showLogin = (req, res) => {
    try {
        const countries = Country.getAllCountries();
        res.render('login', { countries: countries });
    } catch(ex) {
        console.log(ex);
        res.render("500", { error: ex });
    }
};

// Mostrar la página de registro
authController.showRegister = (req, res) => {
    res.render('register');
};

// Mostrar el formulario de restablecimiento de contraseña
authController.showResetPasswordForm = (req, res) => {
    res.render('reset-password');
};

// Mostrar la página de error de inicio de sesión
authController.showerrorLogin = (req, res) => {
    res.render('errorLogin');
};

// Manejar el inicio de sesión
authController.login = async (req, res) => {
    const { userClient, passClient } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const client = await Client.findOne({ where: { userClient } });

        if (!client) {
            console.log("Usuario no encontrado");
            return res.render('errorLogin');
        }

        console.log("Usuario encontrado:", client.userClient);
        console.log("Contraseña ingresada:", passClient);
        console.log("Hash en la base de datos:", client.passClient_hash);

        // Verificar la contraseña encriptada usando bcrypt
        const isPasswordMatch = await bcrypt.compare(passClient, client.passClient_hash);

        console.log("¿Coincide la contraseña?:", isPasswordMatch);

        if (!isPasswordMatch) {
            console.log("Contraseña incorrecta");
            return res.render('errorLogin');
        }

        // Almacena al cliente en la sesión
        req.session.client = client;
        req.session.id = client.idClient;
        res.locals.user = req.session.client;
        res.locals.id = req.session.id;
        res.redirect('/');
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        res.render("500", { error: error });
    }
};

// Manejar el registro de un nuevo cliente
authController.register = async (req, res) => {
    const { nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = bcrypt.hashSync(passClient, 10);
        const newClient = await Client.create({
            nameClient,
            mailClient,
            nationClient,
            phoneClient,
            addressClient,
            userClient,
            passClient_hash: hashedPassword,
            adminUser: false,
        });

        // Iniciar sesión automáticamente después de registrarse
        req.session.client = newClient;
        res.locals.user = req.session.client;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render("500", { error: error });
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
authController.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.render("500", { error: err });
        } else {
            res.locals.user = null;
            res.redirect('/');
        }
    });
};

module.exports = authController;
