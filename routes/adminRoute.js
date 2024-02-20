const { Router } = require('express');
const controller = require('../controllers/adminController');
const router = Router();

router.get('/', controller.showDashboard);
router.get('/products', controller.showProducts);
router.get('/clients', controller.showClients);

module.exports = router;