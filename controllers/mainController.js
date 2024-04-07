// mainController.js
const MainModel = require('../models/mainModel');
const Products = require('../models/product');

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  async getIndex(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;

    const productos = await Products.findAll();

    if(user) {
      // Renderizar la vista con los datos
      res.render('index', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data, product: productos });
    } else {
      res.render("index", { data, product: productos  })
    }
  }
  getLogin(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();

    // Renderizar la vista con los datos
    res.render('login', {  });
  }
  getRegister(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();

    // Renderizar la vista con los datos
    res.render('register', {  });
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
getProfile(req, res) {
  const data = this.model.getData();
  res.locals.user = req.session.client;
  const user = res.locals.user;

  if(user) {
    // Renderizar la vista con los datos
    res.render('profile', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data });
  } else {
    res.render("profile", { data })
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
