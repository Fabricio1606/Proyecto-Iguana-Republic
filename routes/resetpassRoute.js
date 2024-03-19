const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definición de la ruta GET '/resetpass'
router.get('/resetpass', authController.showResetPasswordForm);

// Definición de la ruta POST '/resetpass'
router.post('/resetpass', authController.resetPassword);

// Exportación del enrutador
module.exports = router;
