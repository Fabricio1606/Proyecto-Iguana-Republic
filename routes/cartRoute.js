const { Router } = require("express");
const controller = require("../controllers/cartController");

const router = Router();
router.get("/", controller.showCart);
router.get("/bill", controller.showBill);
router.post("/download", controller.downloadReceipt);
router.get("/checkout", controller.checkout);
router.get("/delete/:id", controller.deleteProductCart);

router.post("/amount", controller.changeQuantity);
router.post("/add", controller.addToCart);
router.post("/checkout/orders", controller.makeOrder);

module.exports = router;
