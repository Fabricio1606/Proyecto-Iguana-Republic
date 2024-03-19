const Products = require('../models/product');
const Clients = require('../models/client');
const Category = require('../models/category');
const Orders = require('../models/orders');
const bcrypt = require('bcryptjs');

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

adminController.showOrders = (req, res) => {
    res.render('admin/orders/orders'); 
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

module.exports = adminController;