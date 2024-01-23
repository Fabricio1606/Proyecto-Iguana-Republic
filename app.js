// app.js
const express = require('express');
const bodyParser = require('body-parser');
const MainController = require('./controllers/mainController');

const app = express();
const port = 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configurar rutas
const mainController = new MainController();
app.get('/', mainController.getIndex.bind(mainController));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});

// app.js

const mysql = require('mysql');

// Paso 3: Configurar los detalles de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'iguanarepublicdb',
});

// Paso 4: Conectar a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
    
    // connection.query('SELECT * FROM tu_tabla', (error, results) => {
    //   if (error) throw error;
    //   console.log('Resultados de la consulta:', results);
    // });
  }
});

// Paso 5: Manejar eventos de conexión y errores
connection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Se perdió la conexión a MySQL.');
  } else {
    throw err;
  }
});

// Paso 6: Cerrar la conexión cuando la aplicación se cierra
process.on('SIGINT', () => {
  connection.end(() => {
    console.log('Conexión MySQL cerrada debido a la terminación de la aplicación.');
    process.exit();
  });
});

// Resto de tu aplicación Node.js
// ...

