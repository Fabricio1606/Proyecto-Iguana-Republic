const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  
  router.get('/login', authController.postLogin.bind(authController));
  router.get('/register', authController.postRegister.bind(authController));

  return router;
};