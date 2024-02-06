// mainController.js
const MainModel = require('../models/mainModel');

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  getIndex(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();
    res.locals.user = req.session.client;
    const user = res.locals.user;
    if(user) {
      // Renderizar la vista con los datos
      res.render('index', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, data });
    } else {
      res.render("index", { data })
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

}

module.exports = MainController;
