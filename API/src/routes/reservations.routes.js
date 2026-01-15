const router = require("express").Router();
const controller = require("../controllers/reservations.controller");

router.get("/test", controller.test);

module.exports = router;