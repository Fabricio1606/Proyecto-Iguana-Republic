const { Router } = require('express');
const controller = require('../controllers/productController');

const router = Router();

router.get('/details/:id', controller.showProduct);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getAllProductsByCategory);

module.exports = router;