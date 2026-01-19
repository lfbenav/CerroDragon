const router = require("express").Router();
const controller = require("../controllers/tourPackageItems.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// Tour Package Items CRUD
router.get("/", controller.getAll);
router.post("/", auth, requirePermission("MANAGE_TOURS"), controller.create);
router.delete("/:id", auth, requirePermission("MANAGE_TOURS"), controller.delete);

module.exports = router;
