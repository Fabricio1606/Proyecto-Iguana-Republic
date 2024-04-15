// mainController.js
const MainModel = require("../models/mainModel");
const Products = require("../models/product");
const CartDetail = require("../models/cartDetail");
const Cart = require("../models/cart");
const Orders = require("../models/orders");
const Client = require("../models/client");
const sequelize = require("../config/sequelize.js");
const bcrypt = require('bcryptjs');
const { Country } = require("country-state-city");

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  async getIndex(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;

    if (user) {
      // Renderizar la vista con los datos
      res.render("index", {
        user: res.locals.user.userClient,
        admin: res.locals.user.adminUser,
        data,
      });
    } else {
      res.render("index", { data });
    }
  }
  getLogin(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();

    // Renderizar la vista con los datos
    res.render("login", {});
  }
  getRegister(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();

    // Renderizar la vista con los datos
    res.render("register", {});
  }
  getaboutUs(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;

    if(user) {
      // Renderizar la vista con los datos
      res.render('aboutUs', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data });
    } else {
      res.render("aboutUs", { data })
    }
  }
  getCart(req, res) {
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;

    if(user) {
      // Renderizar la vista con los datos
      res.render('cart', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data });
    } else {
      res.render("cart", { data })
    }
}
async getProfile(req, res) {
  const data = this.model.getData();
  res.locals.user = req.session.client;
  const user = res.locals.user;

  if(user) {
    const profile = await Client.findOne({
      where: {
        idClient: user.idClient
      }
    })

    const orders = await Orders.findAll({
      where: {
        ClientIdClient: user.idClient
      }
    });
    
    const countries = Country.getAllCountries();
    
    res.render('profile', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data, profile: profile, orders: orders, countries: countries });
  } else {
    res.redirect("login")
  }
}

async getOrderDetail(req, res) {
  const data = this.model.getData();
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const id = req.params.id;

  if(user) {
    const products = await CartDetail.findAll({
      include: Products,
      where: {
        CartIdCart: id
      }
    });

    const records = await sequelize.query("SELECT quantity * unit_price as total FROM cartDetail WHERE cart_id_cart = :id",{
      replacements: { id: id }
    });

    res.render("orderDetails", { user: res.locals.user.userClient, admin: res.locals.user.adminUser, products: products, subtotal: records })
  } else {
    res.render("login");
  }
}

async updateUser(req, res) {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const { nameClient, userClient, addressClient, nationClient, mailClient, phoneClient } = req.body;

  if(user) {
    try {
      await Client.update({
        nameClient: nameClient,
        userClient: userClient,
        addressClient: addressClient,
        nationClient: nationClient,
        mailClient: mailClient,
        phoneClient: phoneClient
      }, {
        where: { idClient: user.idClient }
      });
      
      res.locals.user.userClient = userClient;
      res.locals.user.addressClient = addressClient;
      res.locals.user.nameClient = nameClient;
      res.locals.user.nameClient = nationClient;
      res.locals.user.mailClient = mailClient;
      res.locals.user.phoneClient = phoneClient;
    } catch(ex) {
      res.render("500");
    }
    res.json({
      result: 1,
    });
  } else {
    res.render("login");
  }
}

async updatePassword(req, res) {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  const { oldPass, newPass } = req.body;

  if(user) {
    try {
      const client = await Client.findOne({ where: { idClient: user.idClient } });
      if (!bcrypt.compareSync(oldPass, client.passClient_hash)) {
          res.json({ result: 2 });
      } else {
        const hashedPassword = bcrypt.hashSync(newPass, 10);
        await Client.update({
          passClient_hash: hashedPassword,
        }, {
          where: { idClient: user.idClient }
        })

        res.json({
          result: 1,
        });
      }
    } catch (ex) {
      res.json({
        result: 0,
      });
    }
  } else {
    res.json({
      result: 3,
    });
  }
}

getFincas(req, res) {
  const data = this.model.getData();
  res.locals.user = req.session.client;
  const user = res.locals.user;

  if(user) {
    // Renderizar la vista con los datos
    res.render('fincas', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data });
  } else {
    res.render("fincas", { data })
  }
}

}

module.exports = MainController;
