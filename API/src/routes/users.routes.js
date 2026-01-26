const router = require("express").Router();
const controller = require("../controllers/users.controller");

router.get("/test", controller.test);

// Listados
router.get("/all", controller.getAll);
router.get("/clients", controller.getAllClients);
router.get("/guides", controller.getAllGuides);
router.get("/admins", controller.getAllAdmins);

// Permisos
router.get("/permissions", controller.getAllPermissions);
router.get("/:id/permissions", controller.getPermissionsByUser);
router.get("/:id/role", controller.getRoleIdByUser);
router.post("/permissions/assign", controller.assignPermissionToRole);
router.delete("/permissions/remove", controller.removePermissionFromRole);

// Detalles por tipo
router.get("/:id/client", controller.getClientByUserId);
router.get("/:id/guide", controller.getGuideByUserId);
router.get("/:id/admin", controller.getAdminByUserId);
router.get("/:id/clientId", controller.getClientIdByUserId);

// Updates
router.put("/:id/client", controller.updateClient);
router.put("/:id/guide", controller.updateGuide);
router.put("/:id/admin", controller.updateAdmin);
router.put("/:id", controller.updateUser);

// Activar / desactivar
router.patch("/:id/activate", controller.activateUser);
router.patch("/:id/deactivate", controller.deactivateUser);

router.get("/:id", controller.getById);

module.exports = router;