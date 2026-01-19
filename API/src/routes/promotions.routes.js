const router = require("express").Router();
const controller = require("../controllers/promotions.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// Promotions CRUD
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", auth, requirePermission("MANAGE_PROMOTIONS"), controller.create);
router.put("/:id", auth, requirePermission("MANAGE_PROMOTIONS"), controller.update);
router.delete("/:id", auth, requirePermission("MANAGE_PROMOTIONS"), controller.delete);

module.exports = router;
