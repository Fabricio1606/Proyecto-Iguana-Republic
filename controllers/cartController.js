const { NOW, where } = require("sequelize");
const Cart = require("../models/cart.js");
const CartDetail = require("../models/cartDetail.js");
const Client = require("../models/client.js");
const Delivery = require("../models/delivery.js");
const sequelize = require("../config/sequelize.js");
const Product = require("../models/product.js");
const Orders = require("../models/orders.js");
var easyinvoice = require('easyinvoice');
const fs = require("fs");

const cartController = {};

cartController.showCart = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  if (user) {
    var cart = await Cart.findOne({
      where: {
        ClientIdClient: user.idClient,
        stateCart: 1
      }
    });
  
    if(cart == null) {
      cart = await Cart.create({
        stateCart: 1,
        totalPriceCart: 0,
        ClientIdClient: user.idClient,
      });
    }

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

cartController.changeQuantity = async (req, res) => {
  const { quantity, idProd, idCart } = req.body;

  try {
    await CartDetail.update({
      quantity: quantity
    }, {
      where: {
        ProductIdProd: idProd,
        CartIdCart: idCart
      }
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
          CartIdCart: idCart,
        },
      }
    );

    await Cart.update(
      {
        totalPriceCart: total.dataValues.total,
      },
      {
        where: {
          idCart: idCart,
        },
      }
    );

    const records = await sequelize.query("SELECT quantity * unit_price as total FROM cartDetail WHERE cart_id_cart = :id AND product_id_prod = :prod",{
      replacements: { id: idCart, prod: idProd }
    });
    var subtotal = records[0][0].total;

    res.json({
      result : 1,
      total: total.dataValues.total,
      subtotal: subtotal
    });
  } catch(ex) {
    res.json({
      result : 0
    });
  }
}

cartController.checkout = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;

  if(user) {
    if(user.addressClient != "N/A") {
      const cart = await Cart.findOne({
        where: {
          ClientIdClient: user.idClient,
          stateCart: 1
        }
      });
      res.render("checkout", { user: res.locals.user.userClient, admin: res.locals.user.adminUser, profile: user, cart: cart });
    } else {
      res.redirect("/profile");
    }
  }
}

cartController.makeOrder = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const { idCart, comment, total } = req.body;

  try{
    const order = await Orders.create({
      totalOrder: total,
      ClientIdClient: user.idClient,
      CartIdCart: idCart
    });
  
    await Delivery.create({
      commentDeli: comment,
      OrderIdOrder: order.dataValues.idOrder
    });
    
    res.json({
      result : 1
    });
  } catch(ex) {
    res.json({
      result : ex
    });
  }
}

cartController.showBill = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;

  const cart = await Cart.findOne({
    where: { 
      ClientIdClient: user.idClient,
      stateCart: 1
    }
  })

  const details = await CartDetail.findAll({
    include: Product,
    where: {
      CartIdCart: cart.idCart
    }
  });
    
  const order = await Orders.create({
    totalOrder: cart.totalPriceCart,
    ClientIdClient: user.idClient,
    CartIdCart: cart.idCart
  });

  await Delivery.create({
    OrderIdOrder: order.dataValues.idOrder
  });

  let png = fs.readFileSync("./public/img/logo_alt.png");
  const img = Buffer.from(png).toString("base64");

  var data = {
    // apiKey: "l9rhAyDx0dONmJcw8B9BPepJwCRwcETmGruQax97dQYL7wuZ41xor8YE1YA31SPM", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
    // mode: "development", // Production or development, defaults to production   
    images: {
        // The logo on top of your invoice
        logo: `${img}`,
    },
    // Your own data
    sender: {
        company: "Iguana Republic",
        city: "San Jose",
        country: "Costa Rica"
    },
    client: {
        address: user.addressClient,
        country: user.nationClient
    },
    information: {
        // Invoice number
        number: "001",
        // Invoice data
        date: "2024-04-16"
    },
    products: [
        
    ],
    // The message you would like to display on the bottom of your invoice
    bottomNotice: "Kindly pay your invoice within 15 days.",
    settings: {
        currency: "USD"
    },
    translate: {},
  };

  details.forEach((product) => {
    data.products.push({
      quantity: product.quantity,
      description: product.Product.nameProd,
      price: product.unitPrice
    });
  });

  //Create your invoice! Easy!
  const result = await easyinvoice.createInvoice(data, function (result) {
      //The response will contain a base64 encoded PDF file
      // console.log('PDF base64 string: ', result.pdf);
  });

  let name = `invoice${Date.now()}`

  fs.writeFileSync(`./docs/${name}.pdf`, result.pdf, "base64");

  res.download(`./docs/${name}.pdf`);
}

module.exports = cartController;