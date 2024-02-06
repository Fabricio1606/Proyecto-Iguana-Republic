const { Router } = require('express');
const controller = require('../controllers/clientController');

const router = Router();

router.get('/', controller.all);
router.get("/:id", controller.viewOne);
router.post("/", controller.create);
router.delete("/:id", controller.destroy);
router.put("/:id", controller.edit);

module.exports = router;
