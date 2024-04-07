const { Router } = require("express");
const controller = require("../controllers/cartController");

const router = Router();

router.get("/:id", controller.showCart);
router.get("/", controller.getAllCarts);

module.exports = router;
