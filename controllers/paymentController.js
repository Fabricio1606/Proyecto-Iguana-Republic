const paypal = require("paypal-rest-sdk");
const Orders = require("../models/orders");
const Cart = require("../models/cart");

const CartService = require("../services/cartService");
const OrderService = require("../services/orderService");
const cartService = new CartService();
const orderService = new OrderService();

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_KEY,
  client_secret: PAYPAL_SECRET_KEY,
});

function getUser(req, res) {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  return user;
}

const renderBuyPage = async (req, res, next) => {
  try {
    res.render("checkout");
  } catch (error) {
    next(error)
  }
};

const payProduct = async (req, res, next) => {
  const user = getUser(req, res);
  const cart = await cartService.getCartByClient(user.idClient);

  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/cart/bill",
        cancel_url: "http://localhost:3000/cart/checkout",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Products",
                sku: "001",
                price: cart.totalPriceCart,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: cart.totalPriceCart,
          },
          description: "This is the payment of your products",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const successPage = async (req, res, next) => {
  try {
    const user = getUser(req, res);
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const cart = await cartService.getCartByClient(user.idClient);
    await orderService.createOrder(cart.totalPriceCart, user.idClient, cart.idCart, "");

    const execute_payment_json = {
      payer_id: payerId,
      transctions: [
        {
          amount: {
            currency: "USD",
            total: cart.totalPriceCart,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.render("bill");
        }
      }
    );
  } catch (error) {
    next(error)
  }
};

const cancelPage = async (req, res) => {
  try {
    res.render("cancel");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  renderBuyPage,
  payProduct,
  successPage,
  cancelPage,
};
