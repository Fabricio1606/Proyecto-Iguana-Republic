const paypal = require("paypal-rest-sdk");
const Orders = require("../models/orders");
const Cart = require("../models/cart");

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_KEY,
  client_secret: PAYPAL_SECRET_KEY,
});

const renderBuyPage = async (req, res) => {
  try {
    res.render("checkout");
  } catch (error) {
    console.log(error.message);
  }
};

const payProduct = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const cart = await Cart.findOne({
    where: { ClientIdClient: user.idClient }
  });
  console.log(cart.totalPriceCart);

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
    console.log(error.message);
    console.log(error);
  }
};

const successPage = async (req, res) => {
  try {
    res.locals.user = req.session.client;
    const user = res.locals.user;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const cart = await Cart.findOne({
      where: { 
        ClientIdClient: user.idClient,
        stateCart: 1
      }
    });
    
    const order = await Orders.create({
      totalOrder: cart.totalPriceCart,
      ClientIdClient: user.idClient,
      CartIdCart: cart.idCart
    });
  
    await Delivery.create({
      commentDeli: comment,
      OrderIdOrder: order.dataValues.idOrder
    });

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
    console.log(error.message);
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
