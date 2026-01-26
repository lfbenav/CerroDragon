const router = require("express").Router();
const controller = require("../controllers/calendar.controller");

router.get("/test", controller.test);

// GET mensual: /calendar?year=2026&month=1
router.get("/", controller.getCalendarMonth);

// Upsert de un día: PUT /calendar/day
router.put(
  "/day",
  // auth,
  // requirePermission("MANAGE_TOURS"),
  controller.upsertCalendarDay
);

// Delete de un día (opcional): DELETE /calendar/day?year=...&month=...&day=...
router.delete(
  "/day",
  // auth,
  // requirePermission("MANAGE_TOURS"),
  controller.deleteCalendarDay
);

// Colores (frontend)
router.get("/colors", controller.getCalendarColors);

module.exports = router;
