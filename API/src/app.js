const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
// app.use("/auth", require("./routes/auth.routes"));
app.use("/tours", require("./routes/tours.routes"));
// app.use("/reservations", require("./routes/reservations.routes"));
// app.use("/utils", require("./routes/utils.routes"));

app.use(require("./middlewares/errorHandler.middleware"));

module.exports = app;