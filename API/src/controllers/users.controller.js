const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Users funcionando");
});

// Obtener todos los usuarios registrados
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, email, is_active
        FROM users
    `);

    if (!rows.length) {
        throw new AppError("No hay usuarios disponibles", 404, "USERS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los clientes registrados
exports.getAllClients = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            c.full_name,
            c.phone,
            c.created_at
        FROM users u
        JOIN customers c ON c.user_id = u.id
        ORDER BY c.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay clientes registrados", 404, "CLIENTS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los guías registrados
exports.getAllGuides = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            g.full_name,
            g.phone,
            g.bio,
            g.image_url,
            g.is_active AS guide_active,
            g.created_at
        FROM users u
        JOIN guides g ON g.user_id = u.id
        ORDER BY g.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay guías registrados", 404, "GUIDES_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los administradores registrados
exports.getAllAdmins = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT DISTINCT
            u.id AS user_id,
            u.email,
            u.is_active,
            u.created_at,
            r.name AS role_name
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.name LIKE 'admin:%'
        ORDER BY u.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay administradores registrados", 404, "ADMINS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});