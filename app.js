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

app.use(session({
    secret: 'miSecreto',
    resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Route for the home page, keep only one definition
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

// Rutas de autenticación
app.get('/login', authController.showLogin);
app.get('/register', authController.showRegister);
app.post('/login', authController.login);
app.post('/register', authController.register);
app.post('/logout', authController.logout);

// Ruta para la página principal
app.get('/', (req, res) => {
    // Ajusta esto según tus necesidades o usa el controlador principal si es necesario
    res.render('index');
});

// Rutas para gestionar las tablas de datos
const client = require('./routes/clientRoute');
app.use('/clients', client);

// Iniciar el servidor
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`La aplicación está corriendo en http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error al sincronizar con la base de datos:', err);
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
