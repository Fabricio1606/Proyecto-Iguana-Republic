const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MainController = require('./controllers/mainController');
const AuthController = require('./controllers/authController');
const authRoutes = require('./Routes/authRoutes');
const connection = require('./models/db');
const path = require('path');
const authController = require('./controllers/authController');

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
app.use(express.static(path.resolve('./public')));

// Configuración de rutas
const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));

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
