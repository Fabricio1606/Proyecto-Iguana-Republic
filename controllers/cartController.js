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
  if (user) {
    const cart = await Cart.findOne({
      where: {
        ClientIdClient: user.idClient,
        stateCart: 1
      }
    });
  
    const details = await CartDetail.findAll({
      include: Product,
      where: {
        CartIdCart: cart.idCart
      }
    });

    const records = await sequelize.query("SELECT quantity * unit_price as total FROM cartDetail WHERE cart_id_cart = :id",{
      replacements: { id: cart.idCart}
    });
    
    res.render("cart", {
      user: res.locals.user.userClient,
      admin: res.locals.user.adminUser,
      products: details,
      cart: cart,
      subtotal: records
    });
  } else {
    res.render("login");
  }
};

cartController.deleteProductCart = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const id = req.params.id;
  
  if (user) {
    const cart = await Cart.findOne({
      where: {
        ClientIdClient: user.idClient,
        stateCart: 1
      }
    });

    const productStock = await CartDetail.findOne({
      where: {
        idDetCart: id
      }
    });

    await Product.increment("stockProd", {
      by: productStock.dataValues.quantity,
      where: { idProd: productStock.dataValues.ProductIdProd }
    });

    await productStock.destroy();

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

    if(total.dataValues.total == null) {
      await Cart.update(
        {
          totalPriceCart: 0,
        },
        {
          where: {
            idCart: cart.idCart,
          },
        }
      );
    } else {
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
    }

    res.redirect("/cart");
  } else {
    res.redirect("login");
  }
}

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
