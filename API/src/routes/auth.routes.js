const router = require("express").Router();
const controller = require("../controllers/auth.controller");

const auth = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/permission.middleware");

router.get("/test", controller.test);

// Registro
router.post("/register/client", controller.registerClient);
router.post("/register/admin", auth, requirePermission("MANAGE_ADMINS"), controller.registerAdmin);
router.post("/register/guide", controller.registerGuide);

// Auth
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// Usuario autenticado
router.get("/me", controller.me);
router.post("/refresh-token", controller.refreshToken);

// Recuperación de contraseña
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;