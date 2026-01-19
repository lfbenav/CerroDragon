const router = require("express").Router();
const controller = require("../controllers/users.controller");

router.get("/test", controller.test);

// Listados
router.get("/all", controller.getAll);
router.get("/clients", controller.getAllClients);
router.get("/guides", controller.getAllGuides);
router.get("/admins", controller.getAllAdmins);

// Búsquedas
router.get("/email/:email", controller.getByEmail);
router.get("/:id", controller.getById);

// Detalles de búsqueda por tipo
router.get("/:id/client", controller.getClientByUserId);
router.get("/:id/guide", controller.getGuideByUserId);

// Updates
router.put("/:id", controller.updateUser);
router.put("/:id/client", controller.updateClient);
router.put("/:id/guide", controller.updateGuide);

// Activar y desactivar
router.patch("/:id/activate", controller.activateUser);
router.patch("/:id/deactivate", controller.deactivateUser);

// Permisos
router.get("/permissions", controller.getAllPermissions);
router.get("/:id/permissions", controller.getPermissionsByUser);
router.post("/permissions/assign", controller.assignPermissionToRole);

module.exports = router;