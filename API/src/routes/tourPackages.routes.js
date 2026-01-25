const router = require("express").Router();
const controller = require("../controllers/tourPackages.controller");

const auth = require("../middlewares/auth.middleware");

// Tour Packages CRUD
router.get("/", controller.getAll);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;
