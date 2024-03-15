const productController = {};
const producto = require("../models/product")

productController.showProduct = async (req, res) => {
    res.locals.user = req.session.client;
    const user = res.locals.user;

    const id = req.params.id;
    const product = await producto.findByPk(id);
    
    if(user) {
        // Renderizar la vista con los datos
        res.render('product_detail', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, product : product });
      } else {
        res.render("product_detail", { product : product })
    }
};

productController.getAllProducts = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;

  res.render("products", { user: user });
};

module.exports = productController;