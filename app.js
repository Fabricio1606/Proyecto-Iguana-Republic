const express = require('express');
<<<<<<< HEAD
const MainController = require('./controllers/mainController');
const connection = require('./models/db');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
=======
const session = require('express-session');
const bodyParser = require('body-parser');
const MainController = require('./controllers/mainController');
const AuthController = require('./controllers/authController');
const connection = require('./models/db');
const path = require('path');
const app = express();
const port = 3000;
>>>>>>> 8cee5fb363a9b19f69ef26c7fd9fe8aa2a6df69f

connection.connect((err) => {

});

<<<<<<< HEAD
app.use(express.json());
=======
>>>>>>> 8cee5fb363a9b19f69ef26c7fd9fe8aa2a6df69f

// Configuración de Express
app.use(session({
  secret: 'miSecreto',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configuración de middleware y rutas adicionales
<<<<<<< HEAD
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

=======
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> 8cee5fb363a9b19f69ef26c7fd9fe8aa2a6df69f

// Configuración de rutas
const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));
app.get('/index', mainController.getIndex.bind(mainController));

<<<<<<< HEAD
app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));


// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('Servidor iniciado');
});

// Rutas para gestionar los datos de las tablas
const client = require('./routes/clientRoute');
app.use('/clients', client);
=======
const authController = new AuthController();
// /login
app.get('/login', authController.getLogin.bind(authController));
app.post('/login', authController.getRegister.bind(authController));
// register
app.post('/register', authController.getRegister.bind(authController));
app.get('/register', authController.getRegister.bind(authController));
>>>>>>> 8cee5fb363a9b19f69ef26c7fd9fe8aa2a6df69f

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
