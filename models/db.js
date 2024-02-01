const mysql = require('mysql2');

// Paso 3: Configurar los detalles de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'iguanarepublicdb',
});
module.exports = connection; 

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
    } else {
        console.log('Conexión exitosa a MySQL');
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

