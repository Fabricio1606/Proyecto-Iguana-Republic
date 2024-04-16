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
    const category = await Category.findAll();
    res.render('admin/products/createProduct', { categories : category}); 
};

adminController.createProduct = async (req, res) => {
    const { nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd } = req.body;
    const imgProd = req.file.filename;
    const category = await Category.findOne({
        where: { nomCate: cateProd }
    })
    const CategoryIdCate = category.idCate;
    try {
        const product = await Products.create({
            nameProd,
            imgProd,
            priceProd,
            stockProd,
            shortDescProd,
            descProd,
            CategoryIdCate
        })
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/products")
}

adminController.showModifyProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Products.findByPk(id, {
        include: Category
    });

    const category = await Category.findAll();
    res.render('admin/products/modifyProduct', { categories : category, product : product }); 
};

adminController.modifyProduct = async (req, res) => {
    const { idProd, nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd } = req.body;
    const category = await Category.findOne({
        where: { nomCate: cateProd }
    })
    const CategoryIdCate = category.idCate;

    try{
        const product = await Products.update({
            idProd,
            nameProd,
            priceProd,
            stockProd,
            shortDescProd,
            descProd,
            CategoryIdCate
        }, {
            where: { idProd: idProd }
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/products")
}

adminController.modifyProductImage = async (req, res) => {
    const { idProd, nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd } = req.body;
    const category = await Category.findOne({
        where: { nomCate: cateProd }
    })
    const imgProd = req.file.filename;
    const CategoryIdCate = category.idCate;

    try{
        const product = await Products.update({
            idProd,
            nameProd,
            imgProd,
            priceProd,
            stockProd,
            shortDescProd,
            descProd,
            CategoryIdCate
        }, {
            where: { idProd: idProd }
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/products")
}

adminController.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await Products.destroy({
        where: { idProd : id }
    });

    res.redirect("/dashboard/products")
}

adminController.showFormCategory = (req, res) => {
    res.render("admin/categories/createCategory");
}

adminController.createCategory = async (req, res) => {
    const { nomCate } = req.body;

    try{
        const category = await Category.create({
            nomCate
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/products");
}

adminController.showModifyCategory = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findByPk(id);

    res.render("admin/categories/modifyCategory", { category : category })
}

adminController.modifyCategory = async (req, res) => {
    const { idCate, nomCate } = req.body;

    try{
        const category = await Category.update({
            nomCate
        }, {
            where: { idCate: idCate }
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/products");
}

adminController.deleteCategory = async (req, res) => {
    const id = req.params.id;
    await Category.destroy({
        where: { idCate : id }
    });

    res.redirect("/dashboard/products")
}

adminController.showClients = async (req, res) => {
    const Client = await Clients.findAll();

    res.render('admin/clients/clients', { clients: Client }); 
};

adminController.showInfoClient = async (req, res) => {
    const id = req.params.id;
    const client = await Clients.findByPk(id);
    const orders = await Orders.findAll({
        where: { ClientIdClient: id }
    });
    res.render('admin/clients/infoClient', { client: client, orders: orders }); 
};

adminController.showFormClient = (req, res) => {
    res.render("admin/clients/createClient")
}

adminController.createClient = async (req, res) => {
    const { nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin } = req.body;

    try{
        const hashedPassword = bcrypt.hashSync(passClient_hash, 10);
        const client = await Clients.create({
            nameClient,
            mailClient,
            nationClient,
            phoneClient,
            addressClient,
            userClient,
            passClient_hash: hashedPassword,
            adminUser: userAdmin
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Error');
    }

    res.redirect("/dashboard/clients")
}

adminController.showOrders = async (req, res) => {
    const orders = await Orders.findAll({
        include: [ Clients, Delivery ]
    });
    res.render('admin/orders/orders', { orders: orders }); 
};

adminController.showModifyClient = async (req, res) => {
    const id = req.params.id;
    const client = await Clients.findByPk(id);

    res.render("admin/clients/modifyClient", { client: client})
}

adminController.modifyClient = async (req, res) => {
    const { idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin } = req.body;

    if(passClient_hash === undefined || passClient_hash == null || passClient_hash == "") {
        try{
            const client = await Clients.update({
                nameClient,
                mailClient,
                nationClient,
                phoneClient,
                addressClient,
                userClient,
                adminUser: userAdmin
            }, {
                where: { idClient : idClient }
            });
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal Error');
        }
    } else {
        try{
            const hashedPassword = bcrypt.hashSync(passClient_hash, 10);
            const client = await Clients.update({
                nameClient,
                mailClient,
                nationClient,
                phoneClient,
                addressClient,
                userClient,
                passClient_hash: hashedPassword,
                adminUser: userAdmin
            }, {
                where: { idClient : idClient }
            });
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal Error');
        }
    }

    res.redirect("/dashboard/clients")
}

adminController.deleteClient = async (req, res) => {
    const id = req.params.id;
    await Clients.destroy({
        where: { idClient : id }
    });

    res.redirect("/dashboard/clients")
}

adminController.showCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.render('admin/categories/categories', { categories: categories }); 
}

adminController.showInfoCategory = async (req, res) => {
    const id = req.params.id;
    
    const product = await Products.findAll({
        where: {
        CategoryIdCate : id
        }
    });
    const category = await Category.findOne({
        where: {
            idCate: id
        }
    })

    res.render("admin/categories/infoCategory", { products: product, category: category.nomCate });
}

adminController.showFormOrder = async (req, res) => {
    res.render("admin/orders/createOrder");
}

adminController.createOrder = async (req, res) => {
    const { statusOrder, paymentMethod, clientId, dateDeli, commentDeli } = req.body;

    try {
        var cart = await Cart.findOne({
            where: {
              ClientIdClient: clientId,
              stateCart: 1
            }
        });
        
        if(cart == null) {
            cart = await Cart.create({
              stateCart: 1,
              totalPriceCart: 0,
              ClientIdClient: user.idClient,
            });
        }

        const order = await Orders.create({
            statusOrder: statusOrder,
            paymentMethod: paymentMethod,
            ClientIdClient: clientId,
            CartIdCart: cart.idCart,
            totalOrder: cart.totalPriceCart
        });
  
        await Delivery.create({
            dateDeli: dateDeli,
            commentDeli: commentDeli,
            OrderIdOrder: order.dataValues.idOrder
        });

        res.redirect("/dashboard/orders");
    } catch (ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.deleteOrder = async (req, res) => {
    const id = req.params.id;
    await Orders.destroy({
        where: { idOrder: id }
    });
    res.redirect("/dashboard/orders");
}

adminController.showModifyOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Orders.findByPk(id);
    const delivery = await Delivery.findOne({
        where: { OrderIdOrder: id }
    });

    res.render("admin/orders/modifyOrder", { order: order, delivery: delivery })
}

adminController.modifyOrder = async (req, res) => {
    const { statusOrder, paymentMethod, clientId, dateDeli, commentDeli } = req.body;

    try {
        await Orders.update({
            statusOrder: statusOrder,
            paymentMethod: paymentMethod
        }, {
            where: { ClientIdClient: clientId }
        });

        const order = await Orders.findOne({
            where: { ClientIdClient: clientId }
        });

        await Delivery.update({
            dateDeli: dateDeli,
            commentDeli: commentDeli
        }, {
            where: { OrderIdOrder: order.idOrder }
        });
        res.redirect("/dashboard/orders");
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.showInfoOrder = async (req, res) => {
    const id = req.params.id;

    try {
        const order = await Orders.findByPk(id);
        const client = await Clients.findByPk(order.ClientIdClient);
        const products = await CartDetail.findAll({
            include: Products,
            where: {
                CartIdCart: order.CartIdCart
            }
        });
        const delivery = await Delivery.findOne({
            where: {
                OrderIdOrder: order.idOrder
            }
        });

        res.render("admin/orders/infoOrder", { order: order, client: client, products: products, delivery: delivery })
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.createReport = async (req, res) => {
    const { startDate, endDate } = req.body;

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

    try {
        const data = await workbook.xlsx.writeFile(`${path}/${name}.xlsx`).then(() => {
            res.download(`${path}/${name}.xlsx`);
        });

    } catch(ex) {
        console.log(ex);
        res.render("500")
    }
}

adminController.showSuppliers = async (req, res) => {
    const suppliers = await Supplier.findAll();
    res.render("admin/suppliers/suppliers", { suppliers: suppliers });
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
    const supplier = await Supplier.findByPk(id);
    res.render("admin/suppliers/modifySupplier", { supplier: supplier });
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
    await Supplier.destroy({
        where: { idSupplier: id }
    });

    res.redirect("/dashboard/suppliers");
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

adminController.searchProduct = async (req, res) => {
    const { nameProd } = req.body;

    try {
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
        console.log(ex);
        res.render("500");
    }
}

adminController.searchOrder = async (req, res) => {
    const { startDate, endDate } = req.body;

    try{
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
        console.log(ex);
        res.render("500");
    }
}

adminController.searchClient = async (req, res) => {
    const { userClient } = req.body;

    try {
        const clients = await Clients.findAll({
            where: {
                userClient: {
                    [Op.like] : "%" + userClient + "%"
                }
            }
        });

        res.render("admin/clients/clients", { clients: clients })
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

adminController.searchCategory = async (req, res) => {
    const { nomCate } = req.body;

    try {
        const categories = await Category.findAll({
            where: {
                nomCate: {
                    [Op.like] : "%" + nomCate + "%"
                }
            }
        });

        res.render("admin/categories/categories", { categories: categories })
    } catch(ex) {
        console.log(ex);
        res.render("500");
    }
}

module.exports = adminController;