const express = require('express');
const MainController = require('./controllers/mainController');
const sequelize = require('./config/sequelize');
const cors = require('cors');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = 3000;
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const resetpassRoute = require('./routes/resetpassRoute');
const flash = require('connect-flash');

//Creamos las tablas de la base de datos
const cart = require("./models/cart")
const supplier = require("./models/supplier")
const cartDetail = require("./models/cartDetail")
const orders = require("./models/orders")
const orderDetails = require("./models/orderDetails")
const deliveryZone = require("./models/deliveryZone")
const delivery = require("./models/delivery")
const invoice = require("./models/invoice")
const invoiceDetail = require("./models/invoiceDetail")
const TempPassModel = require("./models/tempPassModel");


// Configuración de express-session
app.use(session({
    secret: 'miSecreto',
    resave: false,
    saveUninitialized: true,
}));

// Configuración de connect-flash
app.use(flash());

// Middleware para hacer que los mensajes flash estén disponibles en todas las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Middleware para hacer 'user' disponible para todas las plantillas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));
app.get('/aboutUs', mainController.getaboutUs.bind(mainController));
app.get('/cart', mainController.getCart.bind(mainController));
app.get('/profile', mainController.getProfile.bind(mainController));
app.get('/fincas', mainController.getFincas.bind(mainController));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"
    );
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', authController.showLogin);
app.get('/register', authController.showRegister);
app.post('/login', authController.login);
app.post('/register', authController.register);
app.get('/logout', authController.logout);
app.get('/resetpass', authController.showResetPasswordForm);
app.post('/resetpass', authController.resetPassword);
app.get('/errorLogin', authController.showerrorLogin);
app.use('/resetpass', resetpassRoute);

// Las demás rutas y configuraciones permanecen sin cambios

const adminRoute = require('./routes/adminRoute');
app.use('/dashboard', adminRoute);
const productRoute = require("./routes/productRoute");
const Cart = require('./models/cart');
app.use('/products', productRoute); 

sequelize
    .sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(port, () => {
            console.log(`La aplicación está corriendo en http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar con la base de datos:', err);
    });

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
