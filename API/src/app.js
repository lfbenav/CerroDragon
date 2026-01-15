const express = require("express");
const cors = require("cors");
const AppError = require("./utils/AppError");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth.routes"));   // Usuarios
app.use("/tours", require("./routes/tours.routes"));    // Tours
// app.use("/reservations", require("./routes/reservations.routes"));   // Reservar tours
// app.use("/utils", require("./routes/utils.routes")); // Cosas como forms de comida, inventario, cabañas, etc.

app.use((req, res, next) => {
    next(new AppError("Ruta no encontrada", 404, "NOT_FOUND"));
});

app.use(require("./middlewares/errorHandler.middleware"));

module.exports = app;