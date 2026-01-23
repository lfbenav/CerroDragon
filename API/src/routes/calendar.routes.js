const router = require("express").Router();
const controller = require("../controllers/calendar.controller");

router.get("/test", controller.test);

// Obtener todo el calendario (global + todos los tours)
router.get("/",controller.getCalendar);

// Obtener calendario de un tour específico
router.get("/:tour_id", controller.getCalendarByTour);

// Crear bloqueo (día global, día específico o weekday)
router.post(
    "/",
    //auth,
    //requirePermission("MANAGE_TOURS"),
    controller.createCalendarEntry
);

// Actualizar bloqueo
router.put(
    "/:id",
    //auth,
    //requirePermission("MANAGE_TOURS"),
    controller.updateCalendarEntry
);

// Eliminar bloqueo
router.delete(
    "/:id",
    //auth,
    //requirePermission("MANAGE_TOURS"),
    controller.deleteCalendarEntry
);

// Colores del calendario (frontend)
router.get("/colors", controller.getCalendarColors);

module.exports = router;