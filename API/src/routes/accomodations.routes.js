const router = require("express").Router();
const controller = require("../controllers/accomodations.controller");

// Solo para hacer pruebas rápidas de funcionamiento
router.get("/test", controller.test);


// Obtener todas las cabañas
router.get("/", controller.getAll);

// Obtener una cabaña por id
router.get("/:id", controller.getById);

// Crear una cabaña
router.post("/", controller.create);

// Actualizar info de una cabaña
router.put("/:id", controller.update);

// Poner si una cabaña está activa o no
router.patch("/:id/status", controller.updateStatus);

// Para borrar una cabaña
router.delete("/:id", controller.remove);


// Ver disponibilidad de una cabaña por rango de fechas
router.get("/:id/availability", controller.getAvailability);


// Para un cliente reservar una cabaña
router.post("/:id/reserve", controller.reserve);

// Ver mis reservaciones de cabañas
router.get("/my-reservations", controller.getMyReservations);

// Obtener todas las reservaciones de todas las cabañas
router.get("/reservations/all", controller.getAllReservations);

// Obtener las reservaciones de una cabaña
router.get("/:id/reservations", controller.getReservations);

// Ver detalle de una reservación
router.get("/reservations/:reservation_id", controller.getReservationById);

// Editar una reservación (fechas o personas)
router.put("/reservations/:reservation_id", controller.updateReservation);

// Confirmar una reservación
router.post("/reservations/:reservation_id/confirm", controller.confirmReservation);

// Cancelar una reservación
router.post("/reservations/:reservation_id/cancel", controller.cancelReservation);

module.exports = router;
