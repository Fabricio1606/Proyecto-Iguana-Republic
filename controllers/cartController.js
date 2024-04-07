const Cart = require("../models/cart.js");

const cartController = {};

cartController.showCart = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const cart = await Cart.findAll();
  if (user) {
    res.render("cart_detail", {
      user: res.locals.user,
      admin: res.locals.admin,
      cart: cart,
    });
  } else {
    res.render("cart_detail", { cart: cart });
  }
};

cartController.getAllCarts = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  res.render("carts", { user: user });
};

module.exports = cartController;
