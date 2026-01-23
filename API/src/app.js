const express = require("express");
const cors = require("cors");
const AppError = require("./utils/AppError");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth.routes"));                          // Registro y login
app.use("/tours", require("./routes/tours.routes"));                        // Tours
app.use("/tags", require("./routes/tags.routes"));                          // Tags
app.use("/tour-packages", require("./routes/tourPackages.routes"));         // Tour Packages
app.use("/tour-package-items", require("./routes/tourPackageItems.routes"));// Tour Package Items
app.use("/reservations", require("./routes/reservations.routes"));          // Reservar tours
app.use("/promotions", require("./routes/promotions.routes"));              // Promociones
app.use("/assign-guide", require("./routes/assignGuide.routes"));           // Asignación de guías
app.use("/my-reservations", require("./routes/myReservations.routes"));     // Reservaciones del cliente
app.use("/documents", require("./routes/documents.routes"));                // Documentos
app.use("/users", require("./routes/users.routes"));                        // Usuarios
app.use("/foods", require("./routes/foods.routes"));                        // Cosas como forms de comida
app.use("/calendar", require("./routes/calendar.routes"));                  // Calendarios
app.use("/accomodations", require("./routes/accomodations.routes"));        // cabañas
app.use("/images", require("./routes/images.routes"));                      // imagenes
app.use("/others", require("./routes/others.routes"));                      // clima, logs, puntos de encuentro, testimonios, políticas, etc.


// inventario, cabañas, etc.

app.use((req, res, next) => {
    next(new AppError("Ruta no encontrada", 404, "NOT_FOUND"));
});

app.use(require("./middlewares/errorHandler.middleware"));

module.exports = app;