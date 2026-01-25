const { Router } = require("express");
const controller = require("../controllers/guides.controller");

const router = Router();

// GET /guides - Get all active guides
router.get("/", controller.getAllGuides);

// GET /guides/:id - Get single guide by id
router.get("/:id", controller.getGuideById);

module.exports = router;
