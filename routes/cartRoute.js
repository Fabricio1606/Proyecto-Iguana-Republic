const { Router } = require("express");
const CartController = require("../controllers/cartController");

const controller = new CartController();
const router = Router();
router.get("/", controller.showCart);
router.get("/bill", controller.showBill);
router.post("/download", controller.downloadReceipt);
router.get("/checkout", controller.checkout);
router.get("/delete/:id", controller.deleteProduct);

router.post("/amount", controller.changeQuantity);
router.post("/add", controller.addToCart);
router.post("/checkout/orders", controller.makeOrder);

module.exports = router;
