const Products = require('../models/product');
const Clients = require('../models/client');
const Category = require('../models/category');
const Orders = require('../models/orders');

const adminController = {};

adminController.showDashboard = async (req, res) => {
    const client = await Clients.count();
    const product = await Products.count();
    const numberOrders = await Orders.count();
    const order = await Orders.findAll({
        include: Clients,
        limit: 5,
        order: [ ["idOrder", "DESC"] ]
    });

    res.render('admin/dashboard', { clients : client, products : product, numOrders : numberOrders, orders : order }); 
};

adminController.showProducts = async (req, res) => {
    const product = await Products.findAll({
        include: Category
    });
    const categories = await Category.findAll();

    res.render('admin/products/products', { products: product, categories: categories }); 
};

adminController.showFormProduct = async (req, res) => {
    res.render('admin/products/createProduct'); 
};

adminController.showClients = async (req, res) => {
    const Client = await Clients.findAll();

    res.render('admin/clients/clients', { clients: Client }); 
};

adminController.showOrders = (req, res) => {
    res.render('admin/orders/orders'); 
};

module.exports = adminController;