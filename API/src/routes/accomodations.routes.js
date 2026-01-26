const router = require("express").Router();
const controller = require("../controllers/accomodations.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// Solo para hacer pruebas rápidas de funcionamiento
router.get("/test", controller.test);

// ===============================
// CLIENTE
// ===============================

// Ver mis reservaciones de cabañas
router.get("/my-reservations", auth, controller.getMyReservations);

// Ver disponibilidad de una cabaña por rango de fechas
router.get("/:id/availability", auth, controller.getAvailability);

// Para un cliente reservar una cabaña
router.post("/:id/reserve", auth, controller.reserve);

// ===============================
// RESERVACIONES (ADMIN)
// ===============================

// Obtener todas las reservaciones de todas las cabañas
router.get("/reservations/all", auth, controller.getAllReservations);

// Ver detalle de una reservación
router.get("/reservations/:reservation_id", auth, controller.getReservationById);

// Editar una reservación (fechas o personas)
router.put("/reservations/:reservation_id", auth, controller.updateReservation);

// Confirmar una reservación
router.post("/reservations/:reservation_id/confirm", auth, controller.confirmReservation);

// Cancelar una reservación
router.post("/reservations/:reservation_id/cancel", auth, controller.cancelReservation);

router.post("/reservations/:id/request-refund", auth, controller.requestRefund);

// Obtener las reservaciones de una cabaña
router.get("/:id/reservations", auth, controller.getReservations);

// ===============================
// CABAÑAS (CRUD)
// ===============================

// Obtener todas las cabañas
router.get("/", controller.getAll);

// Crear una cabaña
router.post("/", controller.create);

// Obtener una cabaña por id
router.get("/:id", controller.getById);

// Actualizar info de una cabaña
router.put("/:id", controller.update);

// Poner si una cabaña está activa o no
router.patch("/:id/status", controller.updateStatus);

// Para borrar una cabaña
router.delete("/:id", controller.remove);

module.exports = router;
