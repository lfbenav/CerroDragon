const router = require("express").Router();
const toursController = require("../controllers/tours.controller");
const tagsController = require("../controllers/tags.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

router.get("/test", toursController.test);

// Tours CRUD
router.get("/", toursController.getAll);
router.get("/all", toursController.getAll);
router.get("/allActive", toursController.getAllActive);
router.get("/:id", toursController.getById);
router.post("/", toursController.create);
router.put("/:id", toursController.update);
router.delete("/:id", toursController.delete);

// Tour Tags
router.get("/:id/tags", tagsController.getByTour);
router.post("/:id/tags", auth, tagsController.addToTour);
router.delete("/:id/tags/:tag_id", auth, tagsController.removeFromTour);

module.exports = router;