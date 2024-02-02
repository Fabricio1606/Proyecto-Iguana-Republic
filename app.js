const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const authRoutes = require('./Routes/authRoutes');
const connection = require('./models/db');
const path = require('path');
const app = express();
const port = 3000;

connection.connect((err) => {

});


// Configuración de Express
app.use(session({
secret: 'miSecreto',
resave: true,
saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configuración de middleware y rutas adicionales
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de rutas
const mainController = new MainController();
app.get('/index', mainController.getIndex.bind(mainController));
app.get('/login', mainController.getLogin.bind(mainController));
app.get('/register', mainController.getRegister.bind(mainController));

app.post('/login', authController.postLogin.bind(authController));
app.post('/register', authController.postRegister.bind(authController));
// Utiliza el controlador de autenticación para manejar las rutas de autenticación
app.use('/auth', authRoutes(authController));

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
