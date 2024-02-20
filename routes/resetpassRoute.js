const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/resetpass', authController.showResetPasswordForm);
router.post('/resetpass', authController.resetPassword);

module.exports = router;
