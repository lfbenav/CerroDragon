const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Tours funcionando");
});

// Obtener todos los toures (hasta los que están deshabilitados)
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, title, description, base_location, is_active
        FROM tours
    `);

    if (!rows.length) {
        throw new AppError("No hay tours disponibles", 404, "TOURS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener solamente los toures activos (disponibles para el usuario)
exports.getAllActive = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, title, description, base_location
        FROM tours
        WHERE is_active = true
    `);

    if (!rows.length) {
        throw new AppError("No hay tours disponibles", 404, "TOURS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});