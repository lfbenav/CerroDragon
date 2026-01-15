const router = require("express").Router();
const controller = require("../controllers/users.controller");

router.get("/test", controller.test);

router.get("/all", controller.getAll);

router.get("/clients", controller.getAllClients);
router.get("/guides", controller.getAllGuides);
router.get("/admins", controller.getAllAdmins);


module.exports = router;