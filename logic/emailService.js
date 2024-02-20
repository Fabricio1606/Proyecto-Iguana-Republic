// emailService.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor(senderEmail) {
        // Configuración del servicio de correo
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'reset.pass.iguanarepublic@gmail.com', // Cambiar por tu dirección de correo electrónico
                pass: 'PASSRECOVERY2201**' // Cambiar por tu contraseña de correo electrónico
            }
        });
        
        // Almacenar el correo electrónico del remitente
        this.senderEmail = senderEmail;
    }

    // Método para enviar un correo electrónico de restablecimiento de contraseña
    async sendPasswordResetEmail(recipientEmail, token) {
        // Configurar el correo electrónico
        const mailOptions = {
            from: this.senderEmail, // Utilizar el correo electrónico del remitente
            to: recipientEmail,
            subject: 'Restablecimiento de contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://tuapp.com/reset/${token}`
        };

        // Enviar el correo electrónico
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Correo electrónico de restablecimiento de contraseña enviado.');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            throw error; // Reenviar el error para que pueda ser manejado en el controlador
        }
    }
}

module.exports = EmailService;
