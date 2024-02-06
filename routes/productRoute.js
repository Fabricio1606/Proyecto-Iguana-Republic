const { Router } = require('express');
const controller = require('../controllers/productController');

const router = Router();

router.get('/:id', controller.showProduct);

module.exports = router;