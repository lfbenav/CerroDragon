const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /assign-guide - Get all guide assignments
exports.getAllAssignments = asyncHandler(async (req, res) => {
    const { reservation_id } = req.query;

    let query = `
        SELECT rg.reservation_id, rg.guide_id, rg.assigned_at,
               g.full_name as guide_name, g.phone as guide_phone,
               r.tour_date, t.title as tour_title
        FROM reservation_guides rg
        JOIN guides g ON g.id = rg.guide_id
        JOIN reservations r ON r.id = rg.reservation_id
        JOIN tours t ON t.id = r.tour_id
    `;
    const params = [];

    if (reservation_id) {
        query += ` WHERE rg.reservation_id = $1`;
        params.push(reservation_id);
    }

    query += ` ORDER BY rg.assigned_at DESC`;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /assign-guide/:reservation_id/:guide_id - Assign guide to reservation
exports.assignGuide = asyncHandler(async (req, res) => {
    const { reservation_id, guide_id } = req.params;

    // Check if reservation exists
    const resCheck = await pool.query(`SELECT id FROM reservations WHERE id = $1`, [reservation_id]);
    if (!resCheck.rows.length) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    // Check if guide exists and is active
    const guideCheck = await pool.query(`SELECT id FROM guides WHERE id = $1 AND is_active = true`, [guide_id]);
    if (!guideCheck.rows.length) {
        throw new AppError("Guía no encontrado o inactivo", 404, "GUIDE_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        INSERT INTO reservation_guides (reservation_id, guide_id)
        VALUES ($1, $2)
        ON CONFLICT (reservation_id, guide_id) DO NOTHING
        RETURNING reservation_id, guide_id, assigned_at
    `, [reservation_id, guide_id]);

    if (!rows.length) {
        throw new AppError("El guía ya está asignado a esta reservación", 409, "ALREADY_ASSIGNED");
    }

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// PUT /assign-guide/:reservation_id/:guide_id - Update assignment (re-assign timestamp)
exports.updateAssignment = asyncHandler(async (req, res) => {
    const { reservation_id, guide_id } = req.params;

    const { rows } = await pool.query(`
        UPDATE reservation_guides
        SET assigned_at = NOW()
        WHERE reservation_id = $1 AND guide_id = $2
        RETURNING reservation_id, guide_id, assigned_at
    `, [reservation_id, guide_id]);

    if (!rows.length) {
        throw new AppError("Asignación no encontrada", 404, "ASSIGNMENT_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /assign-guide/:reservation_id/:guide_id - Remove guide from reservation
exports.removeGuide = asyncHandler(async (req, res) => {
    const { reservation_id, guide_id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM reservation_guides
        WHERE reservation_id = $1 AND guide_id = $2
    `, [reservation_id, guide_id]);

    if (!rowCount) {
        throw new AppError("Asignación no encontrada", 404, "ASSIGNMENT_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Guía removido de la reservación"
    });
});
