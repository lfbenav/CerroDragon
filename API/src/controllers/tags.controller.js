const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /tags - Get all tags
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, name
        FROM tags
        ORDER BY name
    `);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// GET /tours/:id/tags - Get tags for a specific tour
exports.getByTour = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT t.id, t.name
        FROM tags t
        JOIN tour_tags tt ON tt.tag_id = t.id
        WHERE tt.tour_id = $1
        ORDER BY t.name
    `, [id]);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /tours/:id/tags - Add tag to tour
exports.addToTour = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tag_id } = req.body;

    if (!tag_id) {
        throw new AppError("tag_id es requerido", 400, "MISSING_TAG_ID");
    }

    // Check if tour exists
    const tourCheck = await pool.query(`SELECT id FROM tours WHERE id = $1`, [id]);
    if (!tourCheck.rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    // Check if tag exists
    const tagCheck = await pool.query(`SELECT id FROM tags WHERE id = $1`, [tag_id]);
    if (!tagCheck.rows.length) {
        throw new AppError("Tag no encontrado", 404, "TAG_NOT_FOUND");
    }

    await pool.query(`
        INSERT INTO tour_tags (tour_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `, [id, tag_id]);

    res.status(201).json({
        success: true,
        message: "Tag agregado al tour"
    });
});

// DELETE /tours/:id/tags/:tag_id - Remove tag from tour
exports.removeFromTour = asyncHandler(async (req, res) => {
    const { id, tag_id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM tour_tags
        WHERE tour_id = $1 AND tag_id = $2
    `, [id, tag_id]);

    if (!rowCount) {
        throw new AppError("Relación tour-tag no encontrada", 404, "TOUR_TAG_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Tag removido del tour"
    });
});
