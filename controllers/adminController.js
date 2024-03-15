const Products = require('../models/product');
const Clients = require('../models/client');
const Category = require('../models/category');

const adminController = {};

adminController.showDashboard = (req, res) => {
    res.render('admin/dashboard'); 
};

adminController.showProducts = async (req, res) => {
    const product = await Products.findAll({
        include: Category
    });

    res.render('admin/products'); 
};

adminController.showClients = (req, res) => {
    res.render('admin/clients'); 
};

adminController.showOrders = (req, res) => {
    res.render('admin/orders'); 
};

module.exports = adminController;