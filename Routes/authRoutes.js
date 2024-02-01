const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

module.exports = (authController) => {
  // Rutas GET para mostrar las páginas de inicio de sesión y registro
  router.get('/login', authController.getLogin.bind(authController));
  router.get('/register', authController.getRegister.bind(authController));

//router.post('/postlogin', authController.postLogin.bind(authController));
 // router.post('/postregister', authController.postRegister.bind(authController));

  return router;
};
