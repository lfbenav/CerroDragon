const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /promotions
exports.getAll = asyncHandler(async (req, res) => {
    const { tour_id, active_only } = req.query;

    let query = `
        SELECT p.id, p.tour_id, p.title, p.description, p.discount_value,
               p.starts_at, p.ends_at, p.is_active, p.created_at,
               t.title as tour_title
        FROM promotions p
        JOIN tours t ON t.id = p.tour_id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (tour_id) {
        query += ` AND p.tour_id = $${paramIndex++}`;
        params.push(tour_id);
    }

    if (active_only === 'true') {
        query += ` AND p.is_active = true AND (p.starts_at IS NULL OR p.starts_at <= NOW()) AND (p.ends_at IS NULL OR p.ends_at >= NOW())`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// GET /promotions/:id
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT p.id, p.tour_id, p.title, p.description, p.discount_value,
               p.starts_at, p.ends_at, p.is_active, p.created_at,
               t.title as tour_title
        FROM promotions p
        JOIN tours t ON t.id = p.tour_id
        WHERE p.id = $1
    `, [id]);

    if (!rows.length) {
        throw new AppError("Promoción no encontrada", 404, "PROMOTION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// POST /promotions
exports.create = asyncHandler(async (req, res) => {
    const { tour_id, title, description, discount_value, starts_at, ends_at } = req.body;

    if (!tour_id || !title || discount_value === undefined) {
        throw new AppError("tour_id, title y discount_value son requeridos", 400, "MISSING_FIELDS");
    }

    // Check if tour exists
    const tourCheck = await pool.query(`SELECT id FROM tours WHERE id = $1`, [tour_id]);
    if (!tourCheck.rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        INSERT INTO promotions (tour_id, title, description, discount_value, starts_at, ends_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, tour_id, title, description, discount_value, starts_at, ends_at, is_active, created_at
    `, [tour_id, title, description, discount_value, starts_at || null, ends_at || null]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// PUT /promotions/:id
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, discount_value, starts_at, ends_at, is_active } = req.body;

    const { rows } = await pool.query(`
        UPDATE promotions
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            discount_value = COALESCE($3, discount_value),
            starts_at = COALESCE($4, starts_at),
            ends_at = COALESCE($5, ends_at),
            is_active = COALESCE($6, is_active)
        WHERE id = $7
        RETURNING id, tour_id, title, description, discount_value, starts_at, ends_at, is_active, created_at
    `, [title, description, discount_value, starts_at, ends_at, is_active, id]);

    if (!rows.length) {
        throw new AppError("Promoción no encontrada", 404, "PROMOTION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /promotions/:id
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM promotions WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Promoción no encontrada", 404, "PROMOTION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Promoción eliminada"
    });
});
