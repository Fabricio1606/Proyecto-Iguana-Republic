const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para mostrar el formulario de restablecimiento de contraseña (GET)
router.get('/resetpass', authController.showResetPasswordForm);

// Ruta para manejar el envío del formulario de restablecimiento de contraseña (POST)
router.post('/resetpass', authController.resetPassword);

module.exports = router;
