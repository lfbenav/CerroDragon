const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /tour-package-items
exports.getAll = asyncHandler(async (req, res) => {
    const { package_id } = req.query;

    let query = `
        SELECT tpi.id, tpi.package_id, tpi.item_name,
               tp.name as package_name
        FROM tour_package_items tpi
        JOIN tour_packages tp ON tp.id = tpi.package_id
    `;
    const params = [];

    if (package_id) {
        query += ` WHERE tpi.package_id = $1`;
        params.push(package_id);
    }

    query += ` ORDER BY tpi.item_name`;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /tour-package-items
exports.create = asyncHandler(async (req, res) => {
    const { package_id, item_name } = req.body;

    if (!package_id || !item_name) {
        throw new AppError("package_id e item_name son requeridos", 400, "MISSING_FIELDS");
    }

    // Check if package exists
    const pkgCheck = await pool.query(`SELECT id FROM tour_packages WHERE id = $1`, [package_id]);
    if (!pkgCheck.rows.length) {
        throw new AppError("Paquete no encontrado", 404, "PACKAGE_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        INSERT INTO tour_package_items (package_id, item_name)
        VALUES ($1, $2)
        RETURNING id, package_id, item_name
    `, [package_id, item_name]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /tour-package-items/:id
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM tour_package_items WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Item no encontrado", 404, "ITEM_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Item eliminado"
    });
});
