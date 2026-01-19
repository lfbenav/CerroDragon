const router = require("express").Router();
const controller = require("../controllers/documents.controller");

const auth = require("../middlewares/auth.middleware");

// GET /documents/:id - Get single document
router.get("/:id", auth, controller.getById);

module.exports = router;
