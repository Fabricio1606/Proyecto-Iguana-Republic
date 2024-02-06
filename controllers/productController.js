const productController = {};
const producto = require("../models/product")

productController.showProduct = async (req, res) => {
    res.locals.user = req.session.client;
    const user = res.locals.user;

    const id = req.params.id;
    const product = await producto.findByPk(id);
    
    if(user) {
        // Renderizar la vista con los datos
        res.render('product', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, product : product });
      } else {
        res.render("product", { product : product })
    }
};

module.exports = productController;