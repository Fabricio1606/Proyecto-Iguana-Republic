const express = require('express');
const MainController = require('./controllers/mainController');
const sequelize = require('./config/sequelize');
const cors = require('cors');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const authController = require('./controllers/authController');
const Client = require('./models/client');

app.use(session({
    secret: 'miSecreto',
    resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));

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
app.post('/logout', authController.logout);

app.get('/', (req, res) => {
    res.render('index');
});

const clientRoute = require('./routes/clientRoute');
app.use('/clients', clientRoute);

sequelize.sync()
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
