const router = require("express").Router();
const controller = require("../controllers/checkin.controller");

router.get("/test", controller.test);

// =======================
// ADMIN
// =======================
router.get("/formularios", controller.getCheckinForms);
router.post("/formularios", controller.createCheckinForm);
router.put("/formularios/:id/toggle", controller.toggleCheckinForm);
// ADMIN – ver respuestas
router.get("/formularios/:code/entries", controller.getCheckinEntriesByCode);

// =======================
// CLIENTE
// =======================
router.get("/formularios/:code", controller.getCheckinFormByCode);
router.post("/formularios/:code/entries", controller.createCheckinEntry);

module.exports = router;
