const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

module.exports = (authControllerInstance) => {
  // Rutas GET para mostrar las páginas de inicio de sesión y registro
  router.get('/login', authController.getLogin.bind(authController));
  router.get('/register', authController.getRegister.bind(authController));

  // Rutas POST para procesar el formulario de inicio de sesión y registro
  // router.post('/', authController.p.bind(authController));
  // router.post('/', authController.register.bind(authController));

  return router;
};
