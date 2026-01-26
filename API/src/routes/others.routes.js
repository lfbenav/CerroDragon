const router = require("express").Router();
const controller = require("../controllers/others.controller");

// Solo para hacer pruebas rápidas de funcionamiento
router.get("/test", controller.test);

// ====================================
// Condiciones climáticas / Incidencias
// ====================================

// Crear condición climática
router.post("/weather", controller.createWeatherCondition);

// Listar TODAS las condiciones climáticas
router.get("/weather", controller.getAllWeatherConditions);

// Listar SOLO condiciones activas
router.get("/weather/active", controller.getActiveWeatherConditions);

// Activar / desactivar condición climática
router.patch("/weather/:id/toggle", controller.toggleWeatherCondition);

// Eliminar condición climática
router.delete("/weather/:id", controller.deleteWeatherCondition);

// =========
// Auditoría
// =========

// Crear entrada de auditoría
router.post("/audit", controller.createAuditLog);

// Ver todas las entradas de auditoría
router.get("/audit", controller.getAuditLogs);

// ===================
// Puntos de encuentro
// ===================

// Obtener todos los puntos de encuentro
router.get("/meeting-points", controller.getMeetingPoints);

// Crear punto de encuentro
router.post("/meeting-points", controller.createMeetingPoint);

// Actualizar punto de encuentro
router.put("/meeting-points/:id", controller.updateMeetingPoint);

// Eliminar punto de encuentro
router.delete("/meeting-points/:id", controller.deleteMeetingPoint);

// =========
// Políticas
// =========

// Ver todas las políticas
router.get("/policies", controller.getPolicies);

// Crear política
router.post("/policies", controller.createPolicy);

// Actualizar política
router.put("/policies/:id", controller.updatePolicy);

// Eliminar política
router.delete("/policies/:id", controller.deletePolicy);

// ===========
// Testimonios
// ===========

// Crear testimonio
router.post("/testimonials", controller.createTestimonial);

// Ver todos los testimonios (admin)
router.get("/testimonials", controller.getTestimonials);

// Ver solo testimonios aprobados (frontend)
router.get("/testimonials/approved", controller.getApprovedTestimonials);

// Aprobar / rechazar testimonio
router.patch("/testimonials/:id/review", controller.reviewTestimonial);

// ===========
// Inventario
// ===========
router.get("/inventory", controller.getInventoryItems);
router.get("/inventory/:id", controller.getInventoryItemById);
router.post("/inventory", controller.createInventoryItem);
router.put("/inventory/:id", controller.updateInventoryItem);
router.patch("/inventory/:id/adjust", controller.adjustInventoryQuantity);
router.delete("/inventory/:id", controller.deleteInventoryItem);

// ===========
// Consultas
// ===========

// admin
router.get('/consultations', controller.getAllConsultations);
router.patch('/consultations/:id/resolve', controller.resolveConsultation);

// cliente
router.post('/consultations', controller.createConsultation);


module.exports = router;