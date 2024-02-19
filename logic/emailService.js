const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configuración del servicio de correo
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tucorreo@gmail.com', // Cambiar por tu dirección de correo electrónico
                pass: 'tucontraseña' // Cambiar por tu contraseña de correo electrónico
            }
        });
    }

    // Método para enviar un correo electrónico de restablecimiento de contraseña
    async sendPasswordResetEmail(email, token) {
        // Configurar el correo electrónico
        const mailOptions = {
            from: 'tucorreo@gmail.com', // Cambiar por tu dirección de correo electrónico
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://tuapp.com/reset/${token}`
        };

        // Enviar el correo electrónico
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Correo electrónico de restablecimiento de contraseña enviado.');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }
}

module.exports = EmailService;
