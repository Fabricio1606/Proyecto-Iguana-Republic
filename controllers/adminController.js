const Products = require('../models/product');
const Clients = require('../models/client');
const Category = require('../models/category');
const Orders = require('../models/orders');
const Cart = require('../models/cart');
const CartDetail = require('../models/cartDetail');
const Supplier = require('../models/supplier');
const Delivery = require('../models/delivery');
const bcrypt = require('bcryptjs');
const { Sequelize, Op } = require('sequelize');
const exceljs = require("exceljs")
const fs = require('fs').promises;
const ProductService = require("../services/productService");
const ClientService = require("../services/clientService");
const OrderService = require('../services/orderService');

const productService = new ProductService();
const clientService = new ClientService();
const orderService = new OrderService();
const adminController = {};

adminController.showDashboard = async (req, res, next) => {
    try {
        const client = await Clients.count();
        const product = await Products.count();
        const numberOrders = await Orders.count();
        const order = await Orders.findAll({ include: Clients, limit: 5, order: [ ["idOrder", "DESC"] ] });

        res.render('admin/dashboard', { clients : client, products : product, numOrders : numberOrders, orders : order }); 
    } catch(ex) {
        next(ex)
    }
};

adminController.showProducts = async (req, res, next) => {
    try {
        const product = await Products.findAll({ include: Category });
        const categories = await Category.findAll();
    
        res.render('admin/products/products', { products: product, categories: categories }); 
    } catch (ex) {
        next(ex)
    }
};

adminController.showFormProduct = async (req, res, next) => {
    try {
        const category = await Category.findAll();
        res.render('admin/products/createProduct', { categories : category}); 
    } catch(ex) {
        next(ex)
    }
};

adminController.createProduct = async (req, res, next) => {
    try {
        const { name, price, stock, short, desc, cate } = req.body;
        const image = req.file.filename;
        await productService.createProduct(name, price, stock, short, desc, cate, image);
    } catch(error) {
        next(ex)
    }

    res.redirect("/dashboard/products")
}

adminController.showModifyProduct = async (req, res, next) => {    
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        const category = await Category.findAll();
        res.render('admin/products/modifyProduct', { categories : category, product : product }); 
    } catch(ex) {
        next(ex);
    }
};

adminController.modifyProduct = async (req, res, next) => {
    try{
        const { idProd, nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd } = req.body;
        await productService.modifyProduct(idProd, nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd);
        res.redirect("/dashboard/products")
    } catch(error) {
        next(error)
    }
}

adminController.modifyProductImage = async (req, res, next) => {
    try{
        const { idImage } = req.body;
        const imgProd = req.file.filename;
        await Products.update({ imgProd }, { where: { idProd: idImage }});
        res.redirect("/dashboard/products")
    } catch(error) {
        next(error)
    }
}

adminController.deleteProduct = async (req, res, next) => {
    try{
        const id = req.params.id;    
        await Products.destroy({ where: { idProd : id } });
        res.redirect("/dashboard/category")
    } catch(ex) {
        next(ex)
    }
}

adminController.showFormCategory = (req, res) => {
    res.render("admin/categories/createCategory");
}

adminController.createCategory = async (req, res, next) => {
    try{
        const { nomCate } = req.body;
        await Category.create({ nomCate });
        res.redirect("/dashboard/category");
    } catch(error) {
        next(error)
    }
}

adminController.showModifyCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Category.findByPk(id);
        res.render("admin/categories/modifyCategory", { category : category })
    } catch(ex) {
        next(ex);
    }
}

adminController.modifyCategory = async (req, res, next) => {
    try{
        const { idCate, nomCate } = req.body;
        await Category.update({ nomCate }, { where: { idCate: idCate }});
        res.redirect("/dashboard/category");
    } catch(error) {
        next(error)
    }
}

adminController.deleteCategory = async (req, res, next) => {    
    try{
        const id = req.params.id;
        await Category.destroy({ where: { idCate : id }});
        res.redirect("/dashboard/category")
    } catch (ex) {
        next(ex)
    }
}

adminController.showClients = async (req, res, next) => {
    try{
        const Client = await Clients.findAll();
        res.render('admin/clients/clients', { clients: Client }); 
    } catch(ex) {
        next(ex)
    }
};

adminController.showInfoClient = async (req, res, next) => {
    try{
        const id = req.params.id;
        const client = await Clients.findByPk(id);
        const orders = await Orders.findAll({ where: { ClientIdClient: id }});
        res.render('admin/clients/infoClient', { client: client, orders: orders }); 
    } catch(ex) {
        next(ex)
    }
};

adminController.showFormClient = (req, res) => {
    res.render("admin/clients/createClient")
}

adminController.createClient = async (req, res, next) => {
    try{
        const { nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin } = req.body;
        await clientService.createClient(nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin);
        res.redirect("/dashboard/clients")
    } catch(error) {
        next(error)
    }
}

adminController.showOrders = async (req, res, next) => {
    try{
        const orders = await Orders.findAll({ include: [ Clients, Delivery ]});
        res.render('admin/orders/orders', { orders: orders }); 
    } catch(ex) {
        next(ex)
    }
};

adminController.showModifyClient = async (req, res, next) => {
    try{
        const id = req.params.id;
        const client = await Clients.findByPk(id);
        res.render("admin/clients/modifyClient", { client: client})
    } catch(ex) {
        next(ex)
    }
}

adminController.modifyClient = async (req, res, next) => {
    try{
        const { idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin } = req.body;
        await clientService.modifyClient(idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin);
        res.redirect("/dashboard/clients")
    } catch(ex) {
        next(ex)
    }
}

adminController.deleteClient = async (req, res, next) => {
    try{
        const id = req.params.id;
        await Clients.destroy({ where: { idClient : id }});
        res.redirect("/dashboard/clients")
    } catch(ex) {
        next(ex)
    }
}

adminController.showCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/categories/categories', { categories: categories }); 
    } catch(ex) {
        next(ex)
    }
}

adminController.showInfoCategory = async (req, res, next) => {    
    try {
        const id = req.params.id;
        const product = await Products.findAll({ where: { CategoryIdCate : id }});
        const category = await Category.findOne({ where: { idCate: id }});  
        res.render("admin/categories/infoCategory", { products: product, category: category.nomCate });
    } catch(ex){
        next(ex)
    }
}

adminController.showFormOrder = async (req, res) => {
    res.render("admin/orders/createOrder");
}

adminController.createOrder = async (req, res, next) => {
    try {
        const { statusOrder, paymentMethod, clientId, dateDeli, commentDeli } = req.body;
        await orderService.createOrderAdmin(statusOrder, paymentMethod, clientId, dateDeli, commentDeli);
        res.redirect("/dashboard/orders");
    } catch (ex) {
        next(ex)
    }
}

adminController.deleteOrder = async (req, res, next) => {
    try{
        const id = req.params.id;
        await Orders.destroy({ where: { idOrder: id }});
        res.redirect("/dashboard/orders");
    } catch(ex) {
        next(ex)
    }
}

adminController.showModifyOrder = async (req, res, next) => {
    try {    
        const id = req.params.id;
        const order = await Orders.findByPk(id);
        const delivery = await Delivery.findOne({ where: { OrderIdOrder: id }});
        res.render("admin/orders/modifyOrder", { order: order, delivery: delivery })
    } catch(ex) {
        next(ex)
    }
}

adminController.modifyOrder = async (req, res, next) => {
    try {
        const { statusOrder, paymentMethod, clientId, dateDeli, commentDeli } = req.body;
        await orderService.modifyOrder(statusOrder, paymentMethod, clientId, dateDeli, commentDeli);
        res.redirect("/dashboard/orders");
    } catch(ex) {
        next(ex)
    }
}

adminController.showInfoOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await Orders.findByPk(id);
        const client = await Clients.findByPk(order.ClientIdClient);
        const products = await CartDetail.findAll({ include: Products, where: { CartIdCart: order.CartIdCart }});
        const delivery = await Delivery.findOne({ where: { OrderIdOrder: order.idOrder }});
        res.render("admin/orders/infoOrder", { order: order, client: client, products: products, delivery: delivery })
    } catch(ex) {
        next(ex)
    }
}

adminController.createReport = async (req, res, next) => {
    const { startDate, endDate } = req.body;

    try {
        const orders = await Orders.findAll({
            where: {
                dateOrder: {
                    [Op.between] : [startDate, endDate]
                }
            }
        });
    
        let name = "report" + Date.now();
    
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Order");
        const path = "./docs";
    
        worksheet.columns = [
            { header: "ID", key: "idOrder", width: 15 },
            { header: "Date order", key: "dateOrder", width: 15 },
            { header: "Status order", key: "statusOrder", width: 15 },
            { header: "Total order", key: "totalOrder", width: 15, numFmt: '$#,##0.00;$#0' },
        ];
        let counter = 1;
        
        orders.forEach((order) => {
            counter++;
    
            worksheet.addRow({
                idOrder: order.idOrder,
                dateOrder: order.dateOrder,
                statusOrder: order.statusOrder,
                totalOrder: +order.totalOrder
            });
        });
    
        worksheet.getCell(`C${counter+1}`).value = "Total";
        worksheet.getCell(`D${counter+1}`).value = { formula: `SUM(D2:D${counter})`, date1904: false };;
        
    
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true }
        });
        const data = await workbook.xlsx.writeFile(`${path}/${name}.xlsx`).then(() => {
            res.download(`${path}/${name}.xlsx`);
        });

    } catch(ex) {
        next(ex)
    }
}

adminController.showSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.findAll();
        res.render("admin/suppliers/suppliers", { suppliers: suppliers });
    } catch(ex) {
        next(ex)
    }
}

adminController.showFormSupplier = async (req, res) => {
    res.render("admin/suppliers/createSupplier");
}

adminController.createSupplier = async (req, res) =>{
    const { nameSupplier, mailSupplier, phoneSupplier, addressSupplier } = req.body;

    try {
        await Supplier.create({
            nameSupplier: nameSupplier,
            mailSupplier: mailSupplier,
            phoneSupplier: phoneSupplier,
            addressSupplier: addressSupplier
        });

        res.redirect("/dashboard/suppliers");
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.showModifySupplier = async (req, res) => {
    const id = req.params.id;
    
    try{
        const supplier = await Supplier.findByPk(id);
        res.render("admin/suppliers/modifySupplier", { supplier: supplier });
    } catch(ex) {
        console.log(ex)
        res.render("500")
    }
}

adminController.modifySupplier = async (req, res) => {
    const { idSupplier, nameSupplier, mailSupplier, phoneSupplier, addressSupplier } = req.body;

    try {
        await Supplier.update({
            nameSupplier: nameSupplier,
            mailSupplier: mailSupplier,
            phoneSupplier: phoneSupplier,
            addressSupplier: addressSupplier
        }, {
            where: { idSupplier: idSupplier }
        });

        res.redirect("/dashboard/suppliers");
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.deleteSupplier = async (req, res) => {
    const id = req.params.id;
    
    try {
        await Supplier.destroy({
            where: { idSupplier: id }
        });
    
        res.redirect("/dashboard/suppliers");
    } catch (ex) {
        console.log(ex)
        res.render("500")
    }
}

adminController.searchSupplier = async (req, res) => {
    const { nameSupplier } = req.body;

    try{ 
        const suppliers = await Supplier.findAll({
            where: {
                nameSupplier: {
                    [Op.like] : "%" + nameSupplier + "%"
                }
            }
        });

        res.render("admin/suppliers/suppliers", { suppliers: suppliers });
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.searchProduct = async (req, res, next) => {
    try {
        const { nameProd } = req.body;
        const products = await Products.findAll({
            include: Category,
            where: {
                nameProd: {
                    [Op.like] : "%" + nameProd + "%"
                }
            }
        });
        res.render("admin/products/products", { products: products });
    } catch(ex) {
        next(ex)
    }
}

adminController.searchOrder = async (req, res, next) => {
    try{
        const { startDate, endDate } = req.body;
        const orders = await Orders.findAll({
            include: [ Clients, Delivery ],
            where: {
                dateOrder: {
                    [Op.between] : [startDate, endDate]
                }
            }
        });
        res.render("admin/orders/orders", { orders: orders })
    } catch (ex) {
        next(ex);
    }
}

adminController.searchClient = async (req, res, next) => {
    try {
        const { userClient } = req.body;
        const clients = await Clients.findAll({
            where: {
                userClient: {
                    [Op.like] : "%" + userClient + "%"
                }
            }
        });
        res.render("admin/clients/clients", { clients: clients })
    } catch(ex) {
        next(ex)
    }
}

adminController.searchCategory = async (req, res, next) => {
    try {
        const { nomCate } = req.body;
        const categories = await Category.findAll({
            where: {
                nomCate: {
                    [Op.like] : "%" + nomCate + "%"
                }
            }
        });
        res.render("admin/categories/categories", { categories: categories })
    } catch(ex) {
        next(ex)
    }
}

module.exports = adminController;