const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
// app.use("/auth", require("./routes/auth.routes"));   // Usuarios
app.use("/tours", require("./routes/tours.routes"));    // Tours
// app.use("/reservations", require("./routes/reservations.routes"));   // Reservar tours o cabañas
// app.use("/utils", require("./routes/utils.routes")); // Cosas como forms de comida, inventario, etc.

app.use(require("./middlewares/errorHandler.middleware"));  // Esto es para no tener que hacer try catch en todo lado

module.exports = app;