const router = require("express").Router();
const controller = require("../controllers/guides.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// Guide Assignment (Admin only)
router.get("/", auth, requirePermission("MANAGE_RESERVATIONS"), controller.getAllAssignments);
router.post("/:reservation_id/:guide_id", auth, requirePermission("MANAGE_RESERVATIONS"), controller.assignGuide);
router.put("/:reservation_id/:guide_id", auth, requirePermission("MANAGE_RESERVATIONS"), controller.updateAssignment);
router.delete("/:reservation_id/:guide_id", auth, requirePermission("MANAGE_RESERVATIONS"), controller.removeGuide);

module.exports = router;
