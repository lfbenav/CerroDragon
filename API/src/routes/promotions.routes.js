const router = require("express").Router();
const controller = require("../controllers/promotions.controller");

const auth = require("../middlewares/auth.middleware");

// Promotions CRUD
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;
