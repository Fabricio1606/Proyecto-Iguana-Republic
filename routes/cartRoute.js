const { Router } = require("express");
const controller = require("../controllers/cartController");

const router = Router();

router.get("/:id", controller.showCart);
router.get("/", controller.showCart);

router.post("/add", controller.addToCart);
router.get("/delete/:id", controller.deleteProductCart);

module.exports = router;
