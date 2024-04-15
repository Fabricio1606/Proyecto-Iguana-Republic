const mysql = require("mysql2");

// Paso 3: Configurar los detalles de la conexión a MySQL
const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "soraraper1",
  database: "IguanaRepublicDb",
  port: "3306",
});

pool.connect((err) => {
  if (err) {
    console.error("Error de conexión a MySQL:", err);
  } else {
    console.log("Conexión exitosa a MySQL");
  }
});

// Paso 5: Manejar eventos de conexión y errores
pool.on("error", (err) => {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Se perdió la conexión a MySQL.");
  } else {
    throw err;
  }
});

// Paso 6: Cerrar la conexión cuando la aplicación se cierra
process.on("SIGINT", () => {
  pool.end(() => {
    console.log(
      "Conexión MySQL cerrada debido a la terminación de la aplicación."
    );
    process.exit();
  });
});

module.exports = pool;
