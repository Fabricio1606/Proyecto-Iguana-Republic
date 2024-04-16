const { Router } = require('express');
const router = Router();
const controller = require("../controllers/paymentController");

router.get("/", controller.renderBuyPage);
router.post("/pay", controller.payProduct);
router.get("/success", controller.successPage);
router.get("/cancel", controller.cancelPage);

module.exports = router;
