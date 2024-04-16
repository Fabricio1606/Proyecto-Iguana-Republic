const productController = {};
const Category = require("../models/category");
const producto = require("../models/product")

productController.showProduct = async (req, res) => {
    res.locals.user = req.session.client;
    const user = res.locals.user;

    try {
      const id = req.params.id;
      const product = await producto.findByPk(id);
      
      if(user) {
          // Renderizar la vista con los datos
          res.render('product_detail', { user: res.locals.user.userClient, admin: res.locals.user.adminUser, product : product });
        } else {
          res.render("product_detail", { product : product })
      }
    } catch(ex) {
      console.log(ex)
    }
};

productController.getAllProducts = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;

  try {
    const product = await producto.findAll();
    const category = await Category.findAll();

    if(user) {
      res.render("products", { user: res.locals.user.userClient, admin: res.locals.user.adminUser, products : product, categories : category });
    } else {
      res.render("products", { products : product, categories : category })
    }
  } catch(ex) {
    console.log(ex);
    res.render("500");
  }
};

productController.getAllProductsByCategory = async (req, res) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;

  try{
    const id = req.params.id;

    const category = await Category.findAll();
    const product = await producto.findAll({
      where: {
        CategoryIdCate : id
      }
    });
  
    if(user) {
      res.render("products", { user: res.locals.user.userClient, admin: res.locals.user.adminUser, products : product, categories : category });
    } else {
      res.render("products", { products : product, categories : category })
    }
  } catch(ex) {
    console.log(ex);
    res.render("500");
  }
}

module.exports = productController;