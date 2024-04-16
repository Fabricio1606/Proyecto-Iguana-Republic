require("dotenv").config();

const express = require("express");
const sequelize = require("./config/sequelize");
const cors = require("cors");
const app = express();
var http = require("http").Server(app);
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = 3000;
const flash = require("connect-flash");
const paymentRoute = require("./routes/paymentRoute");

//Creamos las tablas de la base de datos
const cart = require("./models/cart");
const supplier = require("./models/supplier");
const cartDetail = require("./models/cartDetail");
const orders = require("./models/orders");
const delivery = require("./models/delivery");
const TempPassModel = require("./models/tempPassModel");

// Configuración de express-session
app.use(
  session({
    secret: "miSecreto",
    resave: false,
    saveUninitialized: true,
  })
);

// Configuración de connect-flash
app.use(flash());

// Middleware para hacer que los mensajes flash estén disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Middleware para hacer 'user' disponible para todas las plantillas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(express.static(path.join(__dirname, "public")));

const authAdmin = (req, res, next) => {
  res.locals.user = req.session.client;
  const user = res.locals.user;
  if (user) {
    const admin = res.locals.user.adminUser;

    if (admin) {
      next();
      return;
    }
  }
  res.render("403");
};

// Las demás rutas y configuraciones permanecen sin cambios

const adminRoute = require("./routes/adminRoute");
app.use("/dashboard", authAdmin, adminRoute);
const productRoute = require("./routes/productRoute");
app.use("/products", productRoute);
const cartController = require("./routes/cartRoute");
app.use("/cart", cartController);
const homeController = require("./routes/homeRoute");
app.use("", homeController);

app.use("*", (req, res) => {
  res.render("404");
});

sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(port, () => {
      console.log(`La aplicación está corriendo en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar con la base de datos:", err);
  });

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render("500");
});

//Metodo de pago de PayPal
app.use("/", paymentRoute);
