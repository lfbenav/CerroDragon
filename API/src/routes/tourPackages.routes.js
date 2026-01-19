const router = require("express").Router();
const controller = require("../controllers/tourPackages.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// Tour Packages CRUD
router.get("/", controller.getAll);
router.post("/", auth, requirePermission("MANAGE_TOURS"), controller.create);
router.put("/:id", auth, requirePermission("MANAGE_TOURS"), controller.update);
router.delete("/:id", auth, requirePermission("MANAGE_TOURS"), controller.delete);

module.exports = router;
