const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MainController = require('./controllers/mainController');
const AuthController = require('./controllers/authController');
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

const authController = new AuthController();
// /login
app.get('/login', authController.getLogin.bind(authController));
app.post('/login', authController.getRegister.bind(authController));
// register
app.post('/register', authController.getRegister.bind(authController));
app.get('/register', authController.getRegister.bind(authController));

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
