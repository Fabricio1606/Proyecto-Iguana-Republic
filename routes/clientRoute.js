const { Router } = require('express');
const controller = require('../controllers/clientController');

const router = Router();

router.get('/', controller.get);
//router.get("/:id", controller.getById);
//router.post("/", controller.create);
//router.delete("/:id", controller.remove);
//router.put("/:id", controller.update);

module.exports = router;