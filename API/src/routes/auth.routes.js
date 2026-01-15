const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.get("/test", controller.test);

router.post("/register/client", controller.registerClient);
router.post("/register/admin", controller.registerAdmin);
router.post("/login", controller.login);

module.exports = router;