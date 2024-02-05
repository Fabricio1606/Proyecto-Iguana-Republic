const express = require('express');
const MainController = require('./controllers/mainController');
const connection = require('./models/db');
const cors = require('cors');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); // Agrega esta línea para importar el módulo path
const port = 3000;

connection.connect((err) => {
  // Manejo de errores de conexión
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

app.use(express.json());

// Configuración de Express
app.use(session({
  secret: 'miSecreto',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configuración de middleware y rutas adicionales
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

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de rutas
const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('Servidor iniciado');
});

// Rutas para gestionar los datos de las tablas
const client = require('./routes/clientRoute');
app.use('/clients', client);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});
