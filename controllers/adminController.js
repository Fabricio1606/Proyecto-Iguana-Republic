const Categories = require('../models/category');
const Products = require('../models/product');
const Clients = require('../models/client');

const adminController = {};

adminController.showDashboard = (req, res) => {
    res.render('admin/dashboard'); 
};

adminController.showProducts = (req, res) => {
    res.render('admin/products'); 
};

adminController.showClients = (req, res) => {
    res.render('admin/clients'); 
};

adminController.showOrders = (req, res) => {
    res.render('admin/orders'); 
};

module.exports = adminController;