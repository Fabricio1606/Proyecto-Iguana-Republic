// mainController.js
const MainModel = require('../models/mainModel');

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  getIndex(req, res) {
    // Obtener datos del modelo
    const data = this.model.getData();

    // Renderizar la vista con los datos
    res.render('index', { data });
  }
}

module.exports = MainController;
