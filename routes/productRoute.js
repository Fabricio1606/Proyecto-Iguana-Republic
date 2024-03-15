const { Router } = require('express');
const controller = require('../controllers/productController');

const router = Router();

router.get('/:id', controller.showProduct);
router.get('/', controller.getAllProducts);

module.exports = router;