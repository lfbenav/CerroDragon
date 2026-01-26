const router = require("express").Router();
const controller = require("../controllers/reservations.controller");
const documentsController = require("../controllers/documents.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

router.get("/test", controller.test);

// Reservations CRUD (Admin)
router.get("/", auth, requirePermission("MANAGE_RESERVATIONS"), controller.getAll);
router.post("/", auth, controller.create);
router.get("/:id", auth, controller.getById);
router.put("/:id", auth, requirePermission("MANAGE_RESERVATIONS"), controller.update);
router.delete("/:id", auth, requirePermission("MANAGE_RESERVATIONS"), controller.delete);
router.get("/fromUser/:userId", auth, controller.getUserReservations);

// Reservation Status (Admin)
router.put("/:id/status", auth, requirePermission("MANAGE_RESERVATIONS"), controller.updateStatus);
router.get("/:id/status-history", auth, controller.getStatusHistory);

// Customer refund request
router.post("/:id/request-refund", auth, controller.requestRefund);

// Reservation Documents
router.get("/:id/documents", auth, documentsController.getByReservation);
router.post("/:id/documents", auth, requirePermission("MANAGE_RESERVATIONS"), documentsController.create);

module.exports = router;