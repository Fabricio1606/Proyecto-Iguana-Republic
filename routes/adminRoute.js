const { Router } = require('express');
const controller = require('../controllers/adminController');
const router = Router();
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, require.main?.path + "/" + 'public/img/products')
    },

    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname.replace()));
    }
})
const upload = multer({ storage: storage })
const modify = multer({ storage: storage })

router.get('/', controller.showDashboard);

// CRUD PRODUCTS
router.get('/products', controller.showProducts);
router.post('/products/search', controller.searchProduct);

router.get('/products/newproduct', controller.showFormProduct);
router.post('/products/newproduct', upload.single("image"), controller.createProduct);

router.get('/products/modify/:id', controller.showModifyProduct);
router.post('/products/modify', controller.modifyProduct);
router.post('/products/modify/:id', modify.single("imgProd"), controller.modifyProductImage);

router.get('/products/delete/:id', controller.deleteProduct);

// CRUD CATEGORIES
router.get('/category', controller.showCategories);
router.post('/category/search', controller.searchCategory);

router.get("/category/info/:id", controller.showInfoCategory);

router.get("/category/newcategory", controller.showFormCategory); 
router.post("/category/newcategory", controller.createCategory);

router.get("/category/modify/:id", controller.showModifyCategory);
router.post("/category/modify", controller.modifyCategory);

router.get('/category/delete/:id', controller.deleteCategory);

// CRUD CLIENTS
router.get('/clients', controller.showClients);
router.post('/clients/search', controller.searchClient);

router.get('/clients/info/:id', controller.showInfoClient);

router.get('/clients/newclient', controller.showFormClient);
router.post('/clients/newclient', controller.createClient);

router.get('/clients/modify/:id', controller.showModifyClient);
router.post('/clients/modify', controller.modifyClient);

router.get('/clients/delete/:id', controller.deleteClient);

// CRUD ORDERS
router.get('/orders', controller.showOrders);
router.post('/orders/search', controller.searchOrder);

router.post('/orders/download', controller.createReport);
router.get('/orders/info/:id', controller.showInfoOrder);

router.get("/orders/neworder", controller.showFormOrder);
router.post("/orders/neworder", controller.createOrder);

router.get("/orders/modify/:id", controller.showModifyOrder);
router.post("/orders/modifyorder", controller.modifyOrder);

router.get('/orders/delete/:id', controller.deleteOrder);

// CRUD SUPPLIERS
router.get("/suppliers", controller.showSuppliers);
router.post("/suppliers/search", controller.searchSupplier);

router.get("/suppliers/newsupplier", controller.showFormSupplier);
router.post("/suppliers/newsupplier", controller.createSupplier);

router.get("/suppliers/modify/:id", controller.showModifySupplier);
router.post("/suppliers/modifysupplier", controller.modifySupplier);

router.get("/suppliers/delete/:id", controller.deleteSupplier);

module.exports = router;