const nodemailer = require("nodemailer");
const TempPassModel = require("../models/tempPassModel"); // Importa el modelo TempPassModel

class EmailService {
  constructor(senderEmail, tempPassModel) {
    // Configuración del servicio de correo
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "reset.pass.iguanarepublic@gmail.com", // Cambiar por tu dirección de correo electrónico
        pass: "efmgkxedhfmxrrcu", // Cambiar por tu contraseña de correo electrónico
      },
    });

    // Almacenar el correo electrónico del remitente
    this.senderEmail = senderEmail;
    this.tempPassModel = tempPassModel; // Asignar el modelo TempPassModel recibido como parámetro
  }

  // Método para enviar un correo electrónico de restablecimiento de contraseña
  async sendPasswordResetEmail(recipientEmail, user_id, temp_password) {
    // Configurar el correo electrónico
    const mailOptions = {
      from: this.senderEmail, // Utilizar el correo electrónico del remitente
      to: recipientEmail,
      subject: "Password Restablishment",
      text: `Here your temporal password, ${temp_password}`,
    };

    // Enviar el correo electrónico
    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email Sent");
      // Guardar la contraseña temporal en la base de datos usando el modelo TempPassModel
      await this.tempPassModel.saveTempPassword(user_id, temp_password);
    } catch (error) {
      console.error("Error to send the email", error);
      throw error; // Reenviar el error para que pueda ser manejado en el controlador
    }
  }
}

module.exports = EmailService;
