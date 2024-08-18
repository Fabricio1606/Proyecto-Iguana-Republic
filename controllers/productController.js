const productController = {};
const Category = require("../models/category");
const producto = require("../models/product")

const ProductService = require("../services/productService");
const productService = new ProductService();

function getUser(req, res) {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  return user;
}

productController.showProduct = async (req, res, next) => {
    try {
      const user = getUser(req, res);
      const id = req.params.id;
      const product = await productService.getProductById(id);

      user ? res.render('product_detail', { user: user.userClient, admin: user.adminUser, product : product })
           : res.render("product_detail", { product : product });
    } catch(ex) {
      next(ex)
    }
};

productController.getAllProducts = async (req, res, next) => {
  try {
    const user = getUser(req, res);
    const product = await producto.findAll();
    const category = await Category.findAll();

    user ? res.render("products", { user: user.userClient, admin: user.adminUser, products : product, categories : category })
         : res.render("products", { products : product, categories : category });
  } catch(ex) {
    next(ex);
  }
};

productController.getAllProductsByCategory = async (req, res, next) => {
  try{
    const id = req.params.id;
    const user = getUser(req, res);

    const category = await Category.findAll();
    const product = await productService.getAllByCategory(id);

    user ? res.render("products", { user: user.userClient, admin: user.adminUser, products : product, categories : category })
         : res.render("products", { products : product, categories : category });
  } catch(ex) {
    next(ex);
  }
}

module.exports = productController;