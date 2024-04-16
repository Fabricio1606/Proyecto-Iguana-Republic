const bcrypt = require('bcryptjs');
const Client = require('../models/client');
const TokenModel = require('../models/tokenModel');
const EmailService = require('../logic/emailService');
const TempPassModel = require('../models/tempPassModel');
const { Country } = require("country-state-city");
const emailService = new EmailService('reset.pass.iguanarepublic@gmail.com', TempPassModel);

const authController = {};

authController.showLogin = (req, res) => {
    try {
        const countries = Country.getAllCountries();
        res.render('login', { countries: countries }); // Renderiza la vista de inicio de sesión
    } catch(ex) {
        console.log(ex);
        res.render("500")
    }
};

authController.showRegister = (req, res) => {
    res.render('register'); // Renderiza la vista de registro
};

// Método para mostrar el formulario de restablecimiento de contraseña
authController.showResetPasswordForm = (req, res) => {
    res.render('reset-password'); // Renderiza la vista reset-password.ejs
};

authController.showerrorLogin = (req, res) => {
    res.render('errorLogin'); // Renderiza la vista errorLogin.ejs
};

authController.login = async (req, res) => {
    const { userClient, passClient } = req.body;

    try {
        const client = await Client.findOne({ where: { userClient } });

        if (!client || !bcrypt.compareSync(passClient, client.passClient_hash)) {
            return res.render('errorLogin'); // Redirige a la vista de errorLogin.ejs
        }

        req.session.client = client; // Almacena al cliente en la sesión
        req.session.id = client.idClient; // Almacena al cliente en la sesión
        res.locals.user = req.session.client;
        res.locals.id = req.session.id;
        res.redirect('/'); // Redirige a la página de dashboard u otra ruta
    } catch (error) {
        console.error(error);
        res.render("500");
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
            adminUser: false,
        });

        req.session.client = newClient;
        req.session.client = newClient;
        res.locals.user = req.session.client;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render("500");
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
            res.render("500");
        } else {
            res.locals.user = null;
            res.redirect('/');
        }
    });
};

module.exports = authController;
