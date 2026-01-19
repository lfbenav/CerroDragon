const router = require("express").Router();
const controller = require("../controllers/tags.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

// GET /tags - Get all tags
router.get("/", controller.getAll);

module.exports = router;
