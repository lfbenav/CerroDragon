const router = require("express").Router();
const reservationsController = require("../controllers/reservations.controller");

const auth = require("../middlewares/auth.middleware");

// GET /my-reservations - Get customer's own reservations
router.get("/", auth, reservationsController.getMyReservations);

module.exports = router;
