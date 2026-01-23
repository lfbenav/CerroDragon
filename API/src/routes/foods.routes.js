const router = require("express").Router();
const controller = require("../controllers/foods.controller");

router.get("/test", controller.test);

// Rutas para comidas
router.get("/comidas", controller.getAllComidas);
router.post("/comidas", controller.createComida);
router.put("/comidas/:id", controller.updateComida);
router.delete("/comidas/:id", controller.deleteComida);

module.exports = router;