const router = require("express").Router();
const controller = require("../controllers/utils.controller");

router.get("/test", controller.test);

module.exports = router;