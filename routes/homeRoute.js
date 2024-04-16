const { Router } = require('express');
const authController = require('../controllers/authController');
const MainController = require('../controllers/mainController');
const resetpassRoute = require('../routes/resetpassRoute');
const router = Router();

const mainController = new MainController();
router.get('/', mainController.getIndex.bind(mainController));
router.get('/aboutUs', mainController.getaboutUs.bind(mainController));
router.get('/profile', mainController.getProfile.bind(mainController));
router.post('/profile/information', mainController.updateUser.bind(mainController));
router.post('/profile/password', mainController.updatePassword.bind(mainController));
router.get('/profile/orders/:id', mainController.getOrderDetail.bind(mainController));
router.get('/fincas', mainController.getFincas.bind(mainController));
router.use('/resetpass', resetpassRoute);

router.get('/login', authController.showLogin);
router.get('/register', authController.showRegister);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/resetpass', authController.showResetPasswordForm);
router.post('/resetpass', authController.resetPassword);
router.get('/errorLogin', authController.showerrorLogin);

module.exports = router;