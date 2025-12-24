const router = require("express").Router();
const controller = require("../controllers/tours.controller");

router.get("/test", controller.test);

router.get("/getAll", controller.getAll);
router.get("/getAllActive", controller.getAllActive);

module.exports = router;