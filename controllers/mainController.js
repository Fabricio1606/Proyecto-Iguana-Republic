// mainController.js
const MainModel = require("../models/mainModel");
const Products = require("../models/product");
const CartDetail = require("../models/cartDetail");
const Cart = require("../models/cart");

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  async getIndex(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;
    console.log(res.locals.user.idClient);
    /*const cart = await Cart.findOne({
      where: { ClientIdClient: res.locals.user.idClient },
    });*/

    const productos = await Products.findAll();

    if (user) {
      // Renderizar la vista con los datos
      res.render("index", {
        user: res.locals.user.userClient,
        admin: res.locals.user.adminUser,
        data,
        product: productos,
      });
    } else {
      res.render("index", { data, product: productos });
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

    // Renderizar la vista con los datos
    res.render("aboutUs", {});
  }
  getCart(req, res) {
    // Renderizar la vista del carrito sin pasar datos
    res.render("cart");
  }
  getProfile(req, res) {
    // Renderizar la vista del carrito sin pasar datos
    res.render("profile");
  }

  getFincas(req, res) {
    // Renderizar la vista del carrito sin pasar datos
    res.render("fincas");
  }
}

module.exports = MainController;
