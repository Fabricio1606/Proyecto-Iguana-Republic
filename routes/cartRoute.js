const { Router } = require("express");
const controller = require("../controllers/cartController");

const router = Router();
router.get("/", controller.showCart);
router.get("/checkout", controller.checkout);
router.get("/delete/:id", controller.deleteProductCart);

router.post("/amount", controller.changeQuantity);
router.post("/add", controller.addToCart);
router.post("/checkout/orders", controller.makeOrder);

module.exports = router;
