const { NOW, where } = require("sequelize");
const Cart = require("../models/cart.js");
const CartDetail = require("../models/cartDetail.js");
const Client = require("../models/client.js");
const sequelize = require("../config/sequelize.js");
const Product = require("../models/product.js");

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
  res.render("cart", {
    user: res.locals.user.userClient,
    admin: res.locals.user.adminUser,
  });
};

cartController.addToCart = async (req, res) => {
  const { idProd, priceProd, quantityProd } = req.body;
  res.locals.user = req.session.client;
  const user = res.locals.user;

  if (user) {
    const cart = await Cart.findOne({
      include: Client,
      where: {
        ClientIdClient: user.idClient,
        stateCart: 1,
      },
    });

    if (cart == null) {
      await Cart.create({
        stateCart: 1,
        totalPriceCart: priceProd,
        ClientIdClient: user.idClient,
      });

      const newCart = await Cart.findOne({
        include: Client,
        where: {
          ClientIdClient: user.idClient,
          stateCart: 1,
        },
      });

      await CartDetail.create({
        quantity: quantityProd,
        unitPrice: priceProd,
        CartIdCart: newCart.idCart,
        ProductIdProd: idProd,
      });
      await Product.decrement("stockProd", {
        by: quantityProd,
        where: { idProd: idProd },
      });

      var total = await CartDetail.findOne(
        {
          attributes: [
            [
              sequelize.fn("SUM", sequelize.literal("quantity * unit_price")),
              "total",
            ],
          ],
        },
        {
          where: {
            CartIdCart: cart.idCart,
          },
        }
      );

      await Cart.update(
        {
          totalPriceCart: total.dataValues.total,
        },
        {
          where: {
            idCart: cart.idCart,
          },
        }
      );

      res.json({
        result: 1,
      });
    } else {
      const detail = await CartDetail.findOne({
        where: {
          CartIdCart: cart.idCart,
          ProductIdProd: idProd,
        },
      });

      if (detail == null) {
        await CartDetail.create({
          quantity: quantityProd,
          unitPrice: priceProd,
          CartIdCart: cart.idCart,
          ProductIdProd: idProd,
        });
        await Product.decrement("stockProd", {
          by: quantityProd,
          where: { idProd: idProd },
        });
      } else {
        await detail.increment("quantity", {
          by: quantityProd,
          where: { CartIdCart: cart.idCart },
        });
        await Product.decrement("stockProd", {
          by: quantityProd,
          where: { idProd: idProd },
        });
      }

      var total = await CartDetail.findOne(
        {
          attributes: [
            [
              sequelize.fn("SUM", sequelize.literal("quantity * unit_price")),
              "total",
            ],
          ],
        },
        {
          where: {
            CartIdCart: cart.idCart,
          },
        }
      );

      await Cart.update(
        {
          totalPriceCart: total.dataValues.total,
        },
        {
          where: {
            idCart: cart.idCart,
          },
        }
      );

      res.json({
        result: 1,
      });
    }
  } else {
    res.json({
      result: 0,
    });
  }
};

module.exports = cartController;
