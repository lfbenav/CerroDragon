const router = require("express").Router();
const controller = require("../controllers/others.controller");

// Solo para hacer pruebas rápidas de funcionamiento
router.get("/test", controller.test);

module.exports = router;