const router = require("express").Router();
const controller = require("../controllers/tours.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

router.get("/test", controller.test);

router.get("/getAll", controller.getAll);
// router.get("/getAll", auth, requirePermission("MANAGE_TOURS"), controller.getAll); //! Asi es como se pone para que solo el que tenga x permiso pueda acceder
router.get("/getAllActive", controller.getAllActive);

module.exports = router;