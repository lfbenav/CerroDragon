const router = require("express").Router();
const controller = require("../controllers/tours.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

router.get("/test", controller.test);

router.get("/all", controller.getAll);
router.get("/allActive", controller.getAllActive);

/*
TODO    Así es como se pone para que solo el que tenga x permiso pueda acceder al endpoint:
!       router.get("/all", auth, requirePermission("MANAGE_TOURS"), controller.getAll); 
*/

module.exports = router;