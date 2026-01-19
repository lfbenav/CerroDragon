const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /tour-packages
exports.getAll = asyncHandler(async (req, res) => {
    const { tour_id } = req.query;

    let query = `
        SELECT tp.id, tp.tour_id, tp.name, tp.price_usd, tp.is_active,
               t.title as tour_title
        FROM tour_packages tp
        JOIN tours t ON t.id = tp.tour_id
    `;
    const params = [];

    if (tour_id) {
        query += ` WHERE tp.tour_id = $1`;
        params.push(tour_id);
    }

    query += ` ORDER BY tp.name`;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /tour-packages
exports.create = asyncHandler(async (req, res) => {
    const { tour_id, name, price_usd } = req.body;

    if (!tour_id || !name || price_usd === undefined) {
        throw new AppError("tour_id, name y price_usd son requeridos", 400, "MISSING_FIELDS");
    }

    // Check if tour exists
    const tourCheck = await pool.query(`SELECT id FROM tours WHERE id = $1`, [tour_id]);
    if (!tourCheck.rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        INSERT INTO tour_packages (tour_id, name, price_usd)
        VALUES ($1, $2, $3)
        RETURNING id, tour_id, name, price_usd, is_active
    `, [tour_id, name, price_usd]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// PUT /tour-packages/:id
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price_usd, is_active } = req.body;

    const { rows } = await pool.query(`
        UPDATE tour_packages
        SET name = COALESCE($1, name),
            price_usd = COALESCE($2, price_usd),
            is_active = COALESCE($3, is_active)
        WHERE id = $4
        RETURNING id, tour_id, name, price_usd, is_active
    `, [name, price_usd, is_active, id]);

    if (!rows.length) {
        throw new AppError("Paquete no encontrado", 404, "PACKAGE_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /tour-packages/:id
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM tour_packages WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Paquete no encontrado", 404, "PACKAGE_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Paquete eliminado"
    });
});
