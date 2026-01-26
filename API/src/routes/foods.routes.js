const router = require("express").Router();
const controller = require("../controllers/foods.controller");

router.get("/test", controller.test);

// =======================
// ADMIN – COMIDAS
// =======================
router.get("/comidas", controller.getMealOptions);
router.post("/comidas", controller.createMealOption);
router.put("/comidas/:id", controller.toggleMealOption);
router.delete("/comidas/:id", controller.deleteMealOption);

// =======================
// ADMIN – FORMULARIOS
// =======================
router.get("/formularios", controller.getMealForms);
router.post("/formularios", controller.createMealForm);
router.put("/formularios/:id/toggle", controller.toggleMealForm);
router.get("/formularios/:code/respuestas", controller.getMealFormResponses);

// =======================
// CLIENTE
// =======================
router.get("/formularios/:code", controller.getMealFormByCode);
router.post("/formularios/:code/respuestas", controller.createMealResponse);

module.exports = router;
