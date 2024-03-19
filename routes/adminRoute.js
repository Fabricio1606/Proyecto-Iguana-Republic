const { Router } = require('express');
const controller = require('../controllers/adminController');
const router = Router();

router.get('/', controller.showDashboard);

// CRUD PRODUCTS
router.get('/products', controller.showProducts);
router.get('/products/newproduct', controller.showFormProduct);

// CRUD CLIENTS
router.get('/clients', controller.showClients);
router.get('/orders', controller.showClients);

// CRUD ORDERS
router.get('/orders', controller.showOrders);

module.exports = router;